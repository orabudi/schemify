import {
  DEFAULT_GUIDELINES,
  GuidelinesOptions,
} from "../lib/interfaces/guidelines-options.interface";
import { VscDebugRestart } from "react-icons/vsc";

interface SecurityGuidelinesModalProps {
  setGuidelines: (options: GuidelinesOptions) => void;
  guidelines: GuidelinesOptions;
}

export default function SecurityGuidelinesModal({
  setGuidelines,
  guidelines,
}: SecurityGuidelinesModalProps) {
  return (
    <aside className="guidelines-panel">
      <div className="guidelines-header">
        <h3>Security Guidelines</h3>
        <button
          className="btn-reset-guidelines"
          onClick={() => setGuidelines(DEFAULT_GUIDELINES)}
          title="Reset to defaults"
        >
          <VscDebugRestart />
        </button>
      </div>

      {/* Numeric Thresholds */}
      <div className="guidelines-section">
        <h4 className="section-title">Thresholds</h4>

        <div className="guideline-item">
          <label htmlFor="max-string-length">Max String Length</label>
          <div className="input-group">
            <input
              id="max-string-length"
              type="number"
              min="1"
              max="10000"
              value={guidelines.maxStringLength}
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  maxStringLength: parseInt(e.target.value) || 1,
                })
              }
            />
            <span className="unit">chars</span>
          </div>
        </div>

        <div className="guideline-item">
          <label htmlFor="max-array-items">Max Array Items</label>
          <div className="input-group">
            <input
              id="max-array-items"
              type="number"
              min="1"
              max="10000"
              value={guidelines.maxArrayItems}
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  maxArrayItems: parseInt(e.target.value) || 1,
                })
              }
            />
            <span className="unit">items</span>
          </div>
        </div>

        <div className="guideline-item">
          <label htmlFor="max-object-properties">Max Object Properties</label>
          <div className="input-group">
            <input
              id="max-object-properties"
              type="number"
              min="1"
              max="10000"
              value={guidelines.maxObjectProperties}
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  maxObjectProperties: parseInt(e.target.value) || 1,
                })
              }
            />
            <span className="unit">props</span>
          </div>
        </div>

        <div className="guideline-item">
          <label htmlFor="max-depth">Max Object Depth</label>
          <div className="input-group">
            <input
              id="max-depth"
              type="number"
              min="1"
              max="100"
              value={guidelines.maxDepth}
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  maxDepth: parseInt(e.target.value) || 1,
                })
              }
            />
            <span className="unit">levels</span>
          </div>
        </div>
      </div>

      {/* Resource Exhaustion (DoS) */}
      <div className="guidelines-section">
        <h4 className="section-title">Resource Exhaustion (DoS)</h4>
        {[
          {
            key: "checkMissingMaxLength",
            label: "Check Missing maxLength",
          },
          {
            key: "checkMaxLengthPermissive",
            label: "Check Permissive maxLength",
          },
          { key: "checkMissingMaxItems", label: "Check Missing maxItems" },
          {
            key: "checkMissingMaxProperties",
            label: "Check Missing maxProperties",
          },
          { key: "checkDepth", label: "Check Nesting Depth" },
          { key: "checkReDoS", label: "Check ReDoS Patterns" },
          { key: "checkCharacterSet", label: "Check Character Sets" },
        ].map((item) => (
          <div key={item.key} className="toggle-item">
            <label htmlFor={item.key}>{item.label}</label>
            <input
              type="checkbox"
              id={item.key}
              checked={
                guidelines[item.key as keyof GuidelinesOptions] as boolean
              }
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  [item.key]: e.target.checked,
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Validation Bypass */}
      <div className="guidelines-section">
        <h4 className="section-title">Validation Bypass</h4>
        {[
          {
            key: "checkAdditionalProperties",
            label: "Check additionalProperties",
          },
          { key: "checkPermissiveTypes", label: "Check Permissive Types" },
          { key: "checkWeakFormats", label: "Check Weak Formats" },
        ].map((item) => (
          <div key={item.key} className="toggle-item">
            <label htmlFor={item.key}>{item.label}</label>
            <input
              type="checkbox"
              id={item.key}
              checked={
                guidelines[item.key as keyof GuidelinesOptions] as boolean
              }
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  [item.key]: e.target.checked,
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Business Logic Flaws */}
      <div className="guidelines-section">
        <h4 className="section-title">Business Logic Flaws</h4>
        {[
          {
            key: "checkConflictingConstraints",
            label: "Check Conflicting Constraints",
          },
          { key: "checkRoleFields", label: "Check Role/Permission Fields" },
          { key: "checkIntegerOverflow", label: "Check Integer Overflow" },
        ].map((item) => (
          <div key={item.key} className="toggle-item">
            <label htmlFor={item.key}>{item.label}</label>
            <input
              type="checkbox"
              id={item.key}
              checked={
                guidelines[item.key as keyof GuidelinesOptions] as boolean
              }
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  [item.key]: e.target.checked,
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Remote References */}
      <div className="guidelines-section">
        <h4 className="section-title">Remote References</h4>
        {[
          { key: "checkRemoteRefs", label: "Check Remote $refs" },
          { key: "checkCircularRefs", label: "Check Circular Refs" },
        ].map((item) => (
          <div key={item.key} className="toggle-item">
            <label htmlFor={item.key}>{item.label}</label>
            <input
              type="checkbox"
              id={item.key}
              checked={
                guidelines[item.key as keyof GuidelinesOptions] as boolean
              }
              onChange={(e) =>
                setGuidelines({
                  ...guidelines,
                  [item.key]: e.target.checked,
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="guideline-info">
        <p>
          Toggle security checks and adjust thresholds to match your
          organization's risk tolerance.
        </p>
      </div>
    </aside>
  );
}
