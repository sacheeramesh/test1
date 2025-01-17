import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import React, { useEffect } from "react";
import sanitizeHtml from "sanitize-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Alert } from "@mui/material";

const RichEditor = (props: {
  onChange?: (value: string) => void;
  value: string | undefined;
  disable: boolean;
}) => {
  const [editorState, setEditorState] = React.useState<EditorState>(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(props.value ?? "").contentBlocks
      )
    )
  );

  useEffect(() => {
    props.onChange &&
      props.onChange(
        sanitizeHtml(draftToHtml(convertToRaw(editorState.getCurrentContent())))
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const toolbar = {
    options: ["inline", "link"],
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["bold", "italic", "underline", "monospace"],
      bold: { className: undefined },
      italic: { className: undefined },
      underline: { className: undefined },
      strikethrough: { className: undefined },
      monospace: { className: undefined },
    },
    fontSize: {
      options: [16, 18, 24, 30, 36, 48, 60, 72, 96],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    list: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["unordered", "ordered", "indent", "outdent"],
      unordered: { className: undefined },
      ordered: { className: undefined },
      indent: { className: undefined },
      outdent: { className: undefined },
    },
    textAlign: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["left", "center", "right", "justify"],
      left: { className: undefined },
      center: { className: undefined },
      right: { className: undefined },
      justify: { className: undefined },
    },

    emoji: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      emojis: ["🖊", "📅", "✅", "❎", "💯", "📢"],
    },
    history: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["undo", "redo"],
      undo: { className: undefined },
      redo: { className: undefined },
    },
  };

  return (
    <>
      {!props.disable === true && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          If you are experiencing any errors when copying the content from
          g-doc, please make sure to add the content to a text editor/note and
          copy it from there before submitting the statement.
        </Alert>
      )}
      <Editor
        readOnly={props.disable}
        toolbarHidden={props.disable}
        toolbar={toolbar}
        editorState={editorState}
        toolbarClassName={props.disable ? "" : "editorClassName"}
        wrapperClassName={props.disable ? "" : "editorClassName"}
        editorClassName={props.disable ? "" : "editorClassName"}
        onEditorStateChange={(es) => setEditorState(es)}
      />
    </>
  );
};

export default RichEditor;
