import React, { useRef, useEffect, useLayoutEffect, useState } from "react";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution";

import "monaco-editor/esm/vs/editor/browser/controller/coreCommands";
import "monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/transpose";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard";
import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController";
import "monaco-editor/esm/vs/editor/contrib/comment/comment";
import "monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu";
import "monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo";
import "monaco-editor/esm/vs/editor/contrib/find/findController";
import "monaco-editor/esm/vs/editor/contrib/folding/folding";
import "monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints";
import "monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect";
import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard";

// monaco.languages.registerDocumentFormattingEditProvider("javascript", {
//   async provideDocumentFormattingEdits(model) {
//     const prettier = await import("prettier/standalone");
//     const babylon = await import("prettier/parser-babylon");
//     const text = prettier.format(model.getValue(), {
//       parser: "babel",
//       plugins: [babylon],
//       singleQuote: true,
//       tabWidth: 2,
//     });

//     return [
//       {
//         range: model.getFullModelRange(),
//         text,
//       },
//     ];
//   },
// });

const languageByExtensions: { [props: string]: string } = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  md: "markdown",
};

const getLanguage = (filename: string) => {
  const ext = filename.split(".").pop() || "";
  return languageByExtensions[ext] || "text";
};

type EditorState = {
  [filename: string]: {
    model: monaco.editor.ITextModel;
    editorViewState: monaco.editor.ICodeEditorViewState | null;
  };
};

type Props = {
  run: (name?: string) => void;
  filename: string;
  text: string;
  setText: (newText: string, newFilename?: string) => void;
};

export const MonacoEditor: React.FC<Props> = ({
  run,
  filename,
  text,
  setText,
}) => {
  console.log("useSandbox");

  const editorDiv = useRef<HTMLDivElement>(null);
  const [
    editor,
    setEditor,
  ] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const subscriptionRef = useRef<monaco.IDisposable[]>([]);
  const editorStateRef = useRef<EditorState>({});

  const unsubscription = () => {
    subscriptionRef.current.forEach((subscription) => {
      subscription.dispose();
    });
    subscriptionRef.current = [];
  };

  useLayoutEffect(() => {
    console.log("useLayoutEffect", editorDiv.current);
    const height =
      editorDiv.current!.parentElement!.clientHeight -
      editorDiv.current!.offsetTop;
    editorDiv.current!.style.height = `${height}px`;

    const _editor = monaco.editor.create(editorDiv.current!, {
      minimap: {
        enabled: true,
      },
      fontSize: 16,
      lineNumbers: "on",
      wordWrap: "on",
      automaticLayout: true,
    });
    _editor.focus();
    setEditor(_editor);
    console.log(1);
    return () => {
      console.log("useLayoutEffect disposed");
      _editor.dispose();
      unsubscription();
    };
  }, []);

  useEffect(() => {
    if (!editor) {
      return;
    }
    // save commandの登録
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      editor.getAction("editor.action.formatDocument").run();
      run("index.test.js");
    });
  }, [run, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    console.log("create model and EditorViewState");

    // text/filename をエディタモデルに変換
    const newModel = () => {
      const model = monaco.editor.createModel(text, getLanguage(filename));
      model.updateOptions({ tabSize: 2 });
      editor.setModel(model);
      editor.focus();
      const editorViewState = editor.saveViewState();
      editorStateRef.current[filename] = { model, editorViewState };
    };

    const updateModel = () => {
      const { model, editorViewState } = editorStateRef.current[filename];
      if (text !== model.getValue()) {
        model.pushEditOperations(
          [],
          [{ range: model.getFullModelRange(), text }],
          () => null
        );
      }
      editor.setModel(model);
      editor.focus();

      if (editorViewState) {
        editor.restoreViewState(editorViewState);
      }
    };

    if (filename in editorStateRef.current) {
      updateModel();
    } else {
      newModel();
    }
  }, [editor, text, filename]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    console.log("create model subscription", filename);
    // 文字入力をsetTextに反映させるフック
    subscriptionRef.current.push(
      editorStateRef.current[filename].model.onDidChangeContent((ev) => {
        editorStateRef.current[
          filename
        ].editorViewState = editor.saveViewState();
        setText(editorStateRef.current[filename].model.getValue());
        // onChange
      })
    );

    return () => {
      unsubscription();
    };
  }, [editor, filename, setText]);

  return <div ref={editorDiv} />;
};
