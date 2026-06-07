export interface GuidelinesOptions {
  // Numeric thresholds
  maxStringLength: number;
  maxArrayItems: number;
  maxObjectProperties: number;
  maxDepth: number;

  // Resource Exhaustion (DoS)
  checkMissingMaxLength: boolean;
  checkMaxLengthPermissive: boolean;
  checkMissingMaxItems: boolean;
  checkMissingMaxProperties: boolean;
  checkDepth: boolean;
  checkReDoS: boolean;
  checkCharacterSet: boolean;

  // Validation Bypass
  checkAdditionalProperties: boolean;
  checkPermissiveTypes: boolean;
  checkWeakFormats: boolean;

  // Business Logic Flaws
  checkConflictingConstraints: boolean;
  checkRoleFields: boolean;
  checkIntegerOverflow: boolean;

  // Remote References
  checkRemoteRefs: boolean;
  checkCircularRefs: boolean;
}

export const DEFAULT_GUIDELINES: GuidelinesOptions = {
  // Numeric thresholds
  maxStringLength: 1000,
  maxArrayItems: 100,
  maxObjectProperties: 100,
  maxDepth: 10,

  // Resource Exhaustion (DoS) - all enabled
  checkMissingMaxLength: true,
  checkMaxLengthPermissive: true,
  checkMissingMaxItems: true,
  checkMissingMaxProperties: true,
  checkDepth: true,
  checkReDoS: true,
  checkCharacterSet: true,

  // Validation Bypass - all enabled
  checkAdditionalProperties: true,
  checkPermissiveTypes: true,
  checkWeakFormats: true,

  // Business Logic Flaws - all enabled
  checkConflictingConstraints: true,
  checkRoleFields: true,
  checkIntegerOverflow: true,

  // Remote References - all enabled
  checkRemoteRefs: true,
  checkCircularRefs: true,
};
