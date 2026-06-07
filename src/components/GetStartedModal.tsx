interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetStartedModal({
  isOpen,
  onClose,
}: GetStartedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop " onClick={onClose}>
      <div
        className="modal modal-large get-started-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2 className="get-started-title">Get Started with Schemify</h2>
        <img src="/logo.png" className="get-started-logo" />

        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Welcome!
        </h3>
        <p className="get-started-text">
          <strong>
            Schemify is your go-to tool for bulletproofing your JSON Schemas.
          </strong>
        </p>
        <p className="get-started-text">
          Whether you're a developer, security engineer, or API designer -
          Schemify provides you with a simplified solution for schema security
          analysis to help you catch vulnerabilities before they make it to
          production.
        </p>

        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          How to Use
        </h3>
        <ol
          className="get-started-text"
          style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}
        >
          <li>
            <strong>Paste or import Your JSON Schema:</strong> Copy your JSON
            Schema and paste it into the "Input JSON Schema".
          </li>
          <li>
            <strong>Customize Thresholds and guidelines:</strong> Adjust the
            security thresholds in the sidebar to fit your organization's needs.
          </li>
          <li>
            <strong>Run Analysis:</strong> Click the "Run Analysis" button to
            scan your schema for security concerns.
          </li>
          <li>
            <strong>Review Results:</strong> Check the "Security Concerns" panel
            on the right to see all detected issues, organized by severity.
          </li>
          <li>
            <strong>Click Issues:</strong> Click any issue to highlight the
            problematic line in your schema for easy reference.
          </li>
        </ol>

        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Security Categories Analyzed
        </h3>
        <p>
          The following security categories are analyzed to identify potential
          vulnerabilities in your JSON Schema:
        </p>
        <p className="get-started-text">
          <strong>Resource Exhaustion (DoS):</strong> Detects unbounded strings,
          arrays, objects, regex patterns prone to ReDoS attacks, and
          excessively nested structures.
        </p>
        <p className="get-started-text">
          <strong>Validation Bypass / Weak Constraints:</strong> Identifies
          missing additionalProperties restrictions, overly permissive types,
          and weak format validations.
        </p>
        <p className="get-started-text">
          <strong>Logical / Business Logic Flaws:</strong> Finds conflicting
          constraints (e.g., minimum &gt; maximum), unrestricted role/permission
          fields, and integer overflow risks.
        </p>
        <p className="get-started-text">
          <strong>Remote Reference Vulnerabilities:</strong> Detects insecure
          remote $ref links, internal metadata references, and circular
          reference loops.
        </p>
        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Customizable Thresholds
        </h3>
        <p className="get-started-text">
          The Security Guidelines sidebar allows you to adjust the following
          security thresholds:
        </p>
        <ul
          className="get-started-text"
          style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}
        >
          <li>
            <strong>Max String Length:</strong> Maximum allowed character length
            for string properties (default: 1000).
          </li>
          <li>
            <strong>Max Array Items:</strong> Maximum allowed number of items in
            arrays (default: 100).
          </li>
          <li>
            <strong>Max Object Properties:</strong> Maximum allowed number of
            properties per object (default: 100).
          </li>
          <li>
            <strong>Max Object Depth:</strong> Maximum allowed nesting depth for
            objects (default: 10).
          </li>
        </ul>
        <p className="get-started-text">
          The Security Guidelines sidebar allows you to adjust which of the
          following security checks are enabled or disabled:
        </p>
        <ul
          className="get-started-text"
          style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}
        >
          <li>
            <strong>Check Missing Max Length:</strong> Ensures all string
            properties have a defined maximum length.
          </li>
          <li>
            <strong>Check Permissive Max Length:</strong> Flags string
            properties with excessively high maxLength values.
          </li>
          <li>
            <strong>Check Missing Max Items:</strong> Ensures all array
            properties have a defined maximum number of items.
          </li>
          <li>
            <strong>Check Missing Max Properties:</strong> Ensures all object
            properties have a defined maximum number of properties.
          </li>
          <li>
            <strong>Check Nesting Depth:</strong> Flags schemas with excessively
            deep nesting of objects and arrays.
          </li>
          <li>
            <strong>Check ReDoS Patterns:</strong> Detects regex patterns that
            could lead to Regular Expression Denial of Service attacks.
          </li>
          <li>
            <strong>Check Character Sets:</strong> Flags string properties that
            allow overly broad character sets, which could be abused for
            injection attacks.
          </li>
          <li>
            <strong>Check additionalProperties:</strong> Ensures that object
            schemas define appropriate restrictions on additionalProperties to
            prevent validation bypass.
          </li>
          <li>
            <strong>Check Permissive Types:</strong> Flags properties that allow
            overly permissive type definitions (e.g., "type": ["string",
            "null"]).
          </li>
          <li>
            <strong>Check Weak Formats:</strong> Detects properties that use
            weak or non-standard format validations (e.g., "format": "email"
            without a maxLength).
          </li>
          <li>
            <strong>Check Conflicting Constraints:</strong> Identifies
            properties with conflicting validation rules (e.g., "minimum": 10
            and "maximum": 5).
          </li>
          <li>
            <strong>Check Role/Permission Fields:</strong> Flags properties that
            could be used for role-based access control without proper
            restrictions.
          </li>
          <li>
            <strong>Check Integer Overflow:</strong> Detects integer properties
            that could be vulnerable to overflow attacks.
          </li>
          <li>
            <strong>Check Remote $refs:</strong> Ensures that remote references
            are secure and do not point to untrusted sources.
          </li>
          <li>
            <strong>Check Circular Refs:</strong> Detects circular references in
            schemas that could lead to infinite loops during validation.
          </li>
        </ul>
        <p>
          Adjust these parameters to enforce stricter or more relaxed security
          standards for your organization. Changes apply instantly to your
          schema analysis.
        </p>

        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Understanding Security Issues
        </h3>
        <p className="get-started-text">Issues are categorized by severity:</p>
        <ul
          className="get-started-text"
          style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}
        >
          <li style={{ paddingBottom: "0.75rem" }}>
            <strong className="get-started-critical">Critical:</strong>{" "}
            Immediate security risks that have to be addressed before
            deployment.
          </li>
          <li style={{ paddingBottom: "0.75rem" }}>
            <strong className="get-started-high">High:</strong> Significant
            vulnerabilities that should be fixed as soon as possible.
          </li>
          <li style={{ paddingBottom: "0.75rem" }}>
            <strong className="get-started-medium">Medium:</strong> Moderate
            concerns that may not be exploitable but could lead to security
            issues if left unaddressed.
          </li>
          <li>
            <strong className="get-started-low">Low:</strong> Minor suggestions
            for improvement that can enhance the overall security posture of
            your schema.
          </li>
        </ul>

        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Tips</h3>
        <ul
          className="get-started-text"
          style={{ paddingLeft: "1.25rem", lineHeight: "1.8" }}
        >
          <li>Click "Clear" to clear your input and start fresh.</li>
          <li>
            The ↺ button in the guidelines panel resets all thresholds to
            default values.
          </li>
          <li>
            Valid JSON is required for analysis. Check your syntax if you get
            errors.
          </li>
        </ul>

        <p
          className="get-started-text"
          style={{ marginTop: "1.5rem", fontStyle: "italic" }}
        >
          Ready to secure your schemas? Start by pasting your JSON Schema and
          clicking "Run Analysis".
        </p>
      </div>
    </div>
  );
}
