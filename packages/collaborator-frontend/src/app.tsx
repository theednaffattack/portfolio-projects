import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { SettingsContext } from "./context/SettingsContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { Editor } from "./editor";
import { EditorCollab } from "./editor-collaboration";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import Settings from "./settings";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
  console.error(error);
}

function App() {
  const initialConfig = {
    editorState: null,
    namespace: "MyEditor",
    nodes: [...PlaygroundNodes],
    theme: PlaygroundEditorTheme,
    onError,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <SettingsContext>
          <div className="editor-shell">
            <EditorCollab />
          </div>
          <Settings />
        </SettingsContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default App;
