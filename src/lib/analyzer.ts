import {
  DEFAULT_GUIDELINES,
  GuidelinesOptions,
} from "./interfaces/guidelines-options.interface";
import { Issue } from "./interfaces/issue.interface";
import { Severity } from "./interfaces/severity.interface";

export const analyzeSchema = (
  rawSchema: string,
  options: GuidelinesOptions = DEFAULT_GUIDELINES,
): Issue[] => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawSchema);
  } catch (error) {
    throw new Error("Invalid JSON: " + String((error as Error).message));
  }

  const issues: Issue[] = [];
  const lines = rawSchema.split("\n");
  const refStack: string[] = [];

  const findLineNumber = (searchStr: string): number => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchStr)) {
        return i + 1; // 1-indexed
      }
    }
    return 1; // default to first line if not found
  };

  const add = (
    title: string,
    details: string,
    severity: Severity,
    lineNumber?: number,
  ) => {
    issues.push({ title, details, severity, lineNumber });
  };

  const detectReDoSPattern = (pattern: string): boolean => {
    const redosIndicators = [
      /(\w+\+)+/, // Multiple quantifiers: "a++"
      /(\w+\*)+/, // Multiple * quantifiers: "a**"
      /\(.*\+.*\)\+/, // Nested quantifiers: "(a+)+"
      /\(.*\*.*\)\*/, // Nested *: "(a*)*"
      /\|.*\|.*\|/, // Complex alternation with quantifiers
      /\(.*\+.*\|.*\+.*\)/, // Alternation with multiple
      /\((?:[^()]*[+*][^()]*)+\)[+*]/, // (a+)+, (a*)*
      /\((?:[^()]*[+*?][^()]*)+\)\{/, // (a+){2,}
      /\((?:[^()]*\{[^}]+\}[^()]*)+\)[+*]/, // (a{1,3})+
      /\((?:[^()]*\?[^()]*)+\)[+*?]/, // (a?)+, (a?)*
      /\((?:[^()]*[+*][^()]*)+\)\?/, // (a+)? , (a*)?
      /\w+[+*?]{2,}/, // a++, a**, a+*, etc.
      /\w+[+*]\?/, // a+?, a*?
      /\w+\?[+*]/, // a?+, a?*
      /\(\.\*\)[+*?]/, // (.*)+, (.*)*
      /\(\.\+\)[+*?]/, // (.+)+
      /\(\.\*\)+/, // (.*)+
      /\(\.\+\)+/, // (.+)+
      /\((?:[^()]+\|[^()]+)+\)[+*]/, // (a|aa)+
      /\((?:[^()]*\|[^()]*)+\)\{/, // (a|b){1,}
      /\((?:[^()]*\|[^()]*)+\)\*/, // (a|b)*
      /\((?:a|a+)+\)/, // (a|aa)+ style
      /\((?:.+\|.+)\)[+*]/, // (.+|.+)+
      /\((?:\w+\|\w+\w+)\)[+*]/, // (a|ab)+
      /\((?:\w+\w+\|\w+)\)[+*]/, // (ab|a)+
      /\((?:[^()]*)?\)[+*]/, // (a?)+
      /\((?:\w?\))\+/, // (a?)+ simplified
      /(\\[dws]\+){2,}/, // (\\d+)+, (\\w+)+, etc.
    ];
    return redosIndicators.some((indicator) => indicator.test(pattern));
  };

  // TODO: check this function
  // Helper to check for overly permissive type arrays
  const isOverlyPermissiveType = (type: any): boolean => {
    if (!Array.isArray(type)) return false;
    // Suspicious if mixing string, null, object, or number without restriction
    const count = type.filter((t) =>
      ["string", "null", "object", "number"].includes(t),
    ).length;
    return count >= 3;
  };

  // Helper to check role/permission fields
  const isSuspiciousRoleField = (key: string, schema: any): boolean => {
    const roleKeywords = [
      "role",
      "permission",
      "access",
      "privilege",
      "admin",
      "user",
    ];
    const isRoleField = roleKeywords.some((kw) =>
      key.toLowerCase().includes(kw),
    );

    if (isRoleField && schema.type === "string" && !("enum" in schema)) {
      return true; // Unrestricted string for role
    }
    return false;
  };

  const checkSchema = (
    schema: any,
    path: string,
    depth: number = 0,
    visited = new WeakSet<object>(),
  ) => {
    if (!schema || typeof schema !== "object") return;
    if (visited.has(schema)) return;
    visited.add(schema);

    const type = schema.type;

    // Extract key from path (e.g., "root.properties.name" -> "name")
    const lastKey = path.split(".").pop() || "root";
    const lineNum = findLineNumber(`"${lastKey}"`);

    if (type === "string") {
      // 1. Missing maxLength
      if (options.checkMissingMaxLength && !("maxLength" in schema)) {
        add(
          `${path} — Missing maxLength`,
          "String type without maxLength allows excessively long input, enabling DoS attacks",
          "critical",
          lineNum,
        );
      } else if (
        options.checkMaxLengthPermissive &&
        typeof schema.maxLength === "number" &&
        schema.maxLength > options.maxStringLength
      ) {
        // 2. MaxLength too permissive
        add(
          `${path} — MaxLength too permissive`,
          `maxLength of ${schema.maxLength} exceeds recommended limit of ${options.maxStringLength}`,
          "high",
          lineNum,
        );
      }

      // TODO: check this check
      // 6. Missing allowed character sets - check for pattern
      if (
        options.checkCharacterSet &&
        !("pattern" in schema) &&
        schema.enum === undefined
      ) {
        add(
          `${path} — Missing character set restrictions`,
          "Consider adding a pattern property to restrict allowed characters and formats",
          "medium",
          lineNum,
        );
      }

      // 5. Regex Injection (ReDoS) detection
      if (
        options.checkReDoS &&
        schema.pattern &&
        typeof schema.pattern === "string"
      ) {
        if (detectReDoSPattern(schema.pattern)) {
          add(
            `${path} — Potential ReDoS vulnerability`,
            `Regular expression '${schema.pattern.substring(0, 50)}...' may cause exponential backtracking`,
            "high",
            lineNum,
          );
        }
      }
    }

    if (type === "array" || schema.items) {
      // 3. Missing maxItems
      if (options.checkMissingMaxItems && !("maxItems" in schema)) {
        add(
          `${path} — Missing maxItems`,
          "Unbounded arrays enable DoS through resource exhaustion; add maxItems to limit array growth",
          "critical",
          lineNum,
        );
      } else if (
        options.checkMissingMaxItems &&
        typeof schema.maxItems === "number" &&
        schema.maxItems > options.maxArrayItems
      ) {
        add(
          `${path} — MaxItems too permissive`,
          `maxItems of ${schema.maxItems} exceeds recommended limit of ${options.maxArrayItems}`,
          "high",
          lineNum,
        );
      }
    }

    if (type === "object" || schema.properties) {
      if (options.checkMissingMaxProperties && !("maxProperties" in schema)) {
        add(
          `${path} — Missing maxProperties`,
          "Unbounded objects can cause DoS through key proliferation; add maxProperties limit",
          "critical",
          lineNum,
        );
      } else if (
        options.checkMissingMaxProperties &&
        typeof schema.maxProperties === "number" &&
        schema.maxProperties > options.maxObjectProperties
      ) {
        add(
          `${path} — MaxProperties too permissive`,
          `maxProperties of ${schema.maxProperties} exceeds recommended limit of ${options.maxObjectProperties}`,
          "high",
          lineNum,
        );
      }

      // 4. No limit on object depth
      if (options.checkDepth && depth > options.maxDepth) {
        add(
          `${path} — Excessive object nesting depth`,
          `Object nesting depth of ${depth} exceeds safe limit of ${options.maxDepth}; consider flattening structure`,
          "high",
          lineNum,
        );
      }
    }

    if (
      (type === "object" || schema.properties) &&
      options.checkAdditionalProperties
    ) {
      // 1. Missing additionalProperties: false
      if (!("additionalProperties" in schema)) {
        add(
          `${path} — additionalProperties undefined`,
          "Schema does not restrict additional properties; should set additionalProperties: false",
          "critical",
          lineNum,
        );
      } else if (schema.additionalProperties === true) {
        add(
          `${path} — additionalProperties: true`,
          "Allowing arbitrary additional properties can bypass validation and introduce security issues",
          "critical",
          lineNum,
        );
      }
    }

    // 2. Overly permissive types
    if (options.checkPermissiveTypes && isOverlyPermissiveType(type)) {
      add(
        `${path} — Overly permissive type array`,
        `Type array "${JSON.stringify(type)}" mixes too many types; restricts validation effectiveness`,
        "medium",
        lineNum,
      );
    }

    // 3. Weak formats
    if (options.checkWeakFormats && schema.type === "string" && schema.format) {
      const weakFormats = ["email", "uri", "url", "date-time"];
      if (weakFormats.includes(schema.format) && !schema.pattern) {
        add(
          `${path} — Weak format validation`,
          `Format "${schema.format}" requires additional pattern validation for security`,
          "medium",
          lineNum,
        );
      }
    }

    if (type === "number" || type === "integer") {
      const hasMin = "minimum" in schema || "exclusiveMinimum" in schema;
      const hasMax = "maximum" in schema || "exclusiveMaximum" in schema;

      // 3. Integer Overflow - no min/max for numbers
      if (options.checkIntegerOverflow && (!hasMin || !hasMax)) {
        add(
          `${path} — Integer overflow risk`,
          "Numbers without min/max constraints can cause overflow in backends with fixed integer sizes",
          "high",
          lineNum,
        );
      }

      // 1. Conflicting rules - minimum > maximum
      if (options.checkConflictingConstraints && hasMin && hasMax) {
        const min = schema.minimum ?? schema.exclusiveMinimum;
        const max = schema.maximum ?? schema.exclusiveMaximum;
        if (typeof min === "number" && typeof max === "number" && min > max) {
          add(
            `${path} — Conflicting constraints`,
            `minimum (${min}) is greater than maximum (${max}); impossible constraint`,
            "high",
            lineNum,
          );
        }
      }
    }

    // 2. Role/permission fields not restricted
    if (
      options.checkRoleFields &&
      schema.properties &&
      typeof schema.properties === "object"
    ) {
      for (const key of Object.keys(schema.properties)) {
        const propSchema = schema.properties[key];
        if (isSuspiciousRoleField(key, propSchema)) {
          add(
            `${path}.properties.${key} — Unrestricted role/permission field`,
            `Field "${key}" appears to control access but lacks enum constraints; attacker could set arbitrary values`,
            "high",
            lineNum,
          );
        }
      }
    }

    // 1. Insecure Remote Refs
    if (schema.$ref && typeof schema.$ref === "string") {
      const ref = schema.$ref;
      if (
        options.checkRemoteRefs &&
        (ref.startsWith("http://") || ref.startsWith("https://"))
      ) {
        add(
          `${path} — Insecure remote $ref`,
          `Remote reference to "${ref}" could be intercepted or redirected to malicious schema`,
          "high",
          lineNum,
        );
      }
      if (
        options.checkRemoteRefs &&
        (ref.includes("localhost") ||
          ref.includes("127.0.0.1") ||
          ref.includes("internal"))
      ) {
        add(
          `${path} — Potential internal metadata reference`,
          "Reference to internal service could expose sensitive schema or metadata",
          "high",
          lineNum,
        );
      }

      // 2. Circular References
      if (options.checkCircularRefs && refStack.includes(ref)) {
        add(
          `${path} — Circular $ref detected`,
          `Reference to "${ref}" creates circular dependency; could cause infinite loop during validation`,
          "high",
          lineNum,
        );
      } else if (options.checkCircularRefs) {
        refStack.push(ref);
      }
    }

    if (schema.enum && Array.isArray(schema.enum) && schema.enum.length > 100) {
      add(
        `${path} — Large enum list`,
        "Large enum with 100+ values can be a sign of brittle design",
        "low",
        lineNum,
      );
    }

    const recurse = (entry: any, key: string) =>
      checkSchema(entry, `${path}.${key}`, depth + 1, visited);

    if (schema.properties && typeof schema.properties === "object") {
      for (const key of Object.keys(schema.properties)) {
        recurse(schema.properties[key], `properties.${key}`);
      }
    }

    if (
      schema.patternProperties &&
      typeof schema.patternProperties === "object"
    ) {
      for (const key of Object.keys(schema.patternProperties)) {
        recurse(schema.patternProperties[key], `patternProperties.${key}`);
      }
    }

    if (
      schema.additionalProperties &&
      typeof schema.additionalProperties === "object"
    ) {
      recurse(schema.additionalProperties, "additionalProperties");
    }

    if (schema.items) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((item: any, idx: number) =>
          recurse(item, `items[${idx}]`),
        );
      } else {
        recurse(schema.items, "items");
      }
    }

    ["allOf", "anyOf", "oneOf"].forEach((combiner) => {
      if (Array.isArray(schema[combiner])) {
        schema[combiner].forEach((subSchema: any, idx: number) =>
          recurse(subSchema, `${combiner}[${idx}]`),
        );
      }
    });

    if (schema.not && typeof schema.not === "object") {
      recurse(schema.not, "not");
    }

    if (
      schema.$ref &&
      typeof schema.$ref === "string" &&
      refStack.includes(schema.$ref)
    ) {
      refStack.pop();
    }
  };

  if (Array.isArray(parsed)) {
    parsed.forEach((entry, idx) => checkSchema(entry, `root[${idx}]`, 0));
  } else {
    checkSchema(parsed, "root", 0);
  }

  if (issues.length === 0) {
    issues.push({
      title: "No security issues detected",
      details: "Schema appears well constrained by the current checks",
      severity: "none",
      lineNumber: 1,
    });
  }

  const unique: Issue[] = [];
  const seen = new Set<string>();
  for (const issue of issues) {
    const key = `${issue.title}|${issue.details}|${issue.severity}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(issue);
    }
  }

  const order: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    none: 4,
  };
  unique.sort((a, b) => order[a.severity] - order[b.severity]);

  return unique;
};
