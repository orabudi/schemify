import { Issue } from "../lib/interfaces/issue.interface";

interface IssuesCardModalProps {
  issues: Issue[];
  severityClass: Record<Issue["severity"], string>;
  handleIssueClick: (issue: Issue) => void;
}

export default function IssuesCardModal({
  issues,
  severityClass,
  handleIssueClick,
}: IssuesCardModalProps) {
  return (
    <div>
      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Security Concerns</h2>
        </div>

        <div className="issue-severity-score-row">
          <div className="score-card">
            <div className="score-num critical">
              {issues.filter((i) => i.severity === "critical").length}
            </div>
            <div className="score-label">Critical</div>
          </div>
          <div className="score-card">
            <div className="score-num high">
              {issues.filter((i) => i.severity === "high").length}
            </div>
            <div className="score-label">High</div>
          </div>
          <div className="score-card">
            <div className="score-num medium">
              {issues.filter((i) => i.severity === "medium").length}
            </div>
            <div className="score-label">Medium</div>
          </div>
          <div className="score-card">
            <div className="score-num low">
              {issues.filter((i) => i.severity === "low").length}
            </div>
            <div className="score-label">Low</div>
          </div>
        </div>
        <div className="issue-list" role="status" aria-live="polite">
          {issues.length === 0 ? (
            <p className="no-issues-detected-text">No issues detected yet.</p>
          ) : (
            issues.map((issue, index) =>
              issue.severity === "none" ? (
                <div className="no-issues-found-list-item">
                  <h1 className="badge badge-none no-issues-title">
                    No Issues Detected
                  </h1>
                  <p className="badge badge-none">
                    Your JSON Schema meets all configured security
                    guidelines.{" "}
                  </p>
                  <p className="badge badge-none">
                    Great job keeping your schema secure!{" "}
                  </p>
                </div>
              ) : (
                <article
                  key={`${issue.title}-${index}`}
                  className={`issue-item ${severityClass[issue.severity]}`}
                  onClick={() => handleIssueClick(issue)}
                  style={{ cursor: "pointer" }}
                >
                  {issue.lineNumber && (
                    <span
                      className={`line-badge badge-${severityClass[issue.severity]}`}
                    >
                      Line {issue.lineNumber} -{" "}
                      {issue.severity.charAt(0).toUpperCase() +
                        issue.severity.slice(1).toLowerCase()}
                    </span>
                  )}
                  <h4>{issue.title}</h4>
                  <h4></h4>
                  <p className="issue-details">{issue.details}</p>
                </article>
              ),
            )
          )}
        </div>
      </section>
    </div>
  );
}
