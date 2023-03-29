import { CodeNode } from "@lexical/code";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { LexicalEditor } from "lexical";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { useState } from "react";
import * as Y from "yjs";

import { createWebsocketProvider } from "./collaboration";
import ActionsPlugin from "./plugins/actions-plugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import PollPlugin from "./plugins/poll-plugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import ToolbarPlugin from "./plugins/toolbar-plugin";
import YouTubePlugin from "./plugins/you-tube-plugin";

function initialEditorState(editor: LexicalEditor): void {
  const root = $getRoot();
  const paragraph = $createParagraphNode();
  const text = $createTextNode("Welcome to collab!");
  paragraph.append(text);
  root.append(paragraph);
}

export function EditorCollab() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const initialConfig = {
    // NOTE: This is critical for collaboration plugin to set editor state to null. It
    // would indicate that the editor should not try to set any default state
    // (not even empty one), and let collaboration plugin do it instead
    editorState: null,
    namespace: "Demo",
    nodes: [CodeNode],
    onError: (error: Error) => {
      throw error;
    },
    theme: {},
  };

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <ContentEditable className="edit-document ContentEditable__root" />
              </div>
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CollaborationPlugin
          id="playground"
          providerFactory={(id, yjsDocMap) => {
            const doc = new Y.Doc();
            yjsDocMap.set(id, doc);

            const provider = createWebsocketProvider(id, yjsDocMap);

            return provider;
          }}
          cursorColor="pink"
          username="boa constrictor"
          // Optional initial editor state in case collaborative Y.Doc won't
          // have any existing data on server. Then it'll user this value to populate editor.
          // It accepts same type of values as LexicalComposer editorState
          // prop (json string, state object, or a function)
          initialEditorState={initialEditorState}
          shouldBootstrap={true}
        />
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ActionsPlugin isRichText={true} />
        <PollPlugin />
        <YouTubePlugin />
        {floatingAnchorElem && !isSmallWidthViewport ? (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
            <TableCellActionMenuPlugin
              anchorElem={floatingAnchorElem}
              cellMerge={true}
            />
            <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
          </>
        ) : (
          ""
        )}
      </LexicalComposer>
    </div>
  );
}
