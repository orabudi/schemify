// Wire Monaco to run fully offline (no CDN).
//
// 1. Point @monaco-editor/react's loader at the locally bundled `monaco-editor`
//    package instead of fetching it from a CDN at runtime.
// 2. Provide the web workers via Vite's native `?worker` imports. We only need
//    the JSON language worker (the editor uses defaultLanguage="json") plus the
//    base editor worker.
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });
