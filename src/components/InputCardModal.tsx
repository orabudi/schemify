import { Editor } from "@monaco-editor/react";
import { FaTrashAlt } from "react-icons/fa";
import { LuImport } from "react-icons/lu";

interface InputCardModalProps {
  editorRef: React.MutableRefObject<any>;
  importJSONSchema: (event: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
  setInput: (value: string) => void;
  runAnalysis: () => void;
  reset: () => void;
  message: string;
}

const handleEditorWillMount = (monaco: any) => {
  monaco.editor.defineTheme("customTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0a0f14",
      "editorLineNumber.foreground": "#2acdd6",
      "editorGutter.background": "#0a0f14",
    },
  });
};

export default function InputCardModal({
  editorRef,
  importJSONSchema,
  input,
  setInput,
  runAnalysis,
  reset,
  message,
}: InputCardModalProps) {
  return (
    <div>
      <section className="card">
        <div className="input-card-header">
          <h2>Input JSON Schema</h2>
          <span className="import-container ">
            <LuImport className="import-icon" />
            <input
              className="import-file "
              type="file"
              accept=".json,.txt,application/json,text/plain"
              onChange={importJSONSchema}
              title="Import JSON Schema"
            ></input>
          </span>
        </div>
        <div className="editor-wrapper">
          <Editor
            className="code-highlight"
            value={input}
            onChange={(e) => setInput(e || "")}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            defaultLanguage="json"
            options={{
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              cursorStyle: "line",
              lineNumbersMinChars: 4,
              glyphMargin: false,
              lineDecorationsWidth: 0,
              lineHeight: 1.5,
            }}
            beforeMount={handleEditorWillMount}
            theme="customTheme"
            defaultValue="{}"
            loading={
              <h3 style={{ padding: "1rem", fontWeight: "normal" }}>
                Loading Editor...
              </h3>
            }
          ></Editor>
        </div>
        <div className="analysis-buttons-wrapper">
          <button className="btn btn-run-analysis" onClick={runAnalysis}>
            Run Analysis
          </button>
          <button
            className="btn btn-secondary"
            style={{ marginLeft: "0.75rem" }}
            onClick={reset}
          >
            <FaTrashAlt className="clear-btn-icon" />
            &nbsp;Clear
          </button>
        </div>
        <p className="analysis-instructions">{message}</p>
      </section>
    </div>
  );
}
