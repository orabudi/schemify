import { useState, useEffect, useRef } from "react";
import { analyzeSchema } from "./lib/analyzer";
import AboutModal from "./components/AboutModal";
import GetStartedModal from "./components/GetStartedModal";
import FooterModal from "./components/FooterModal";
import HeaderModal from "./components/HeaderModal";
import SecurityGuidelinesModal from "./components/SecurityGuidelinesModal";
import InputCardModal from "./components/InputCardModal";
import IssuesCardModal from "./components/IssuesCardModal";
import { Severity } from "./lib/interfaces/severity.interface";
import { Issue } from "./lib/interfaces/issue.interface";
import {
  DEFAULT_GUIDELINES,
  GuidelinesOptions,
} from "./lib/interfaces/guidelines-options.interface";

const severityClass: Record<Severity, string> = {
  critical: "issue-critical",
  high: "issue-high",
  medium: "issue-medium",
  low: "issue-low",
  none: "issue-none",
};

export default function App() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [message, setMessage] = useState("Paste JSON Schema and click Run Analysis");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [guidelines, setGuidelines] = useState<GuidelinesOptions>(DEFAULT_GUIDELINES);
  const editorRef = useRef<any>(null);

  const runAnalysis = () => {
    try {
      const result = analyzeSchema(input.trim(), guidelines);
      setIssues(result);
      setMessage(`${input.length} characters analyzed`);
      setHighlightedLine(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Error: ${errMsg}`);
      setIssues([]);
      setHighlightedLine(null);
    }
  };

  const reset = () => {
    setInput("");
    setIssues([]);
    setMessage("Paste JSON Schema and click Run Analysis");
    setHighlightedLine(null);
  };

  useEffect(() => {
    if (input.trim()) {
      try {
        const result = analyzeSchema(input.trim(), guidelines);
        setIssues(result);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        setMessage(`Error: ${errMsg}`);
      }
    }
  }, [guidelines]);

  const handleIssueClick = (issue: Issue) => {
    if (issue.lineNumber && editorRef.current) {
      setHighlightedLine(issue.lineNumber);
      const lineNum = issue.lineNumber;
      editorRef.current.revealLineInCenter(lineNum);
      editorRef.current.setPosition({ lineNumber: lineNum, column: 1 });
      editorRef.current.focus();
    }
  };

  const importJSONSchema = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileContent = await selectedFile.text();
      setInput(fileContent);
      e.target.value = "";
    }
  };

  return (
    <div className="app-shell">
      <HeaderModal setGetStartedOpen={() => setGetStartedOpen(true)} />

      <main className="app-main">
        <SecurityGuidelinesModal guidelines={guidelines} setGuidelines={setGuidelines} />

        <InputCardModal
          editorRef={editorRef}
          importJSONSchema={importJSONSchema}
          input={input}
          setInput={setInput}
          runAnalysis={runAnalysis}
          reset={reset}
          message={message}
        />

        <IssuesCardModal issues={issues} severityClass={severityClass} handleIssueClick={handleIssueClick} />
      </main>

      <FooterModal openAbout={() => setAboutOpen(true)} />

      {aboutOpen && <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />}

      {getStartedOpen && <GetStartedModal isOpen={getStartedOpen} onClose={() => setGetStartedOpen(false)} />}
    </div>
  );
}
