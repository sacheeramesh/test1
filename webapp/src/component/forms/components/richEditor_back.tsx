import React, { useEffect } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Alert } from "@mui/material";

import { createReactEditorJS } from "react-editor-js";
import _ from "lodash";

const { EDITOR_JS_TOOLS } = require("./richEditor_plugins");

const ReactEditorJS = createReactEditorJS();

const RichEditor = (props: {
  onChange?: (value: string) => void;
  hideAlert?: boolean;
  value: string | undefined;
  disable: boolean;
}) => {
  const LIMIT = 5000;

  const [content, setContent] = React.useState<string | undefined>(props.value);
  const [limit, setLimit] = React.useState<number>(0);

  useEffect(() => {
    props.onChange && props.onChange(content || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // const editorCore = React.useRef<any>(null);

  // const handleInitialize = React.useCallback((instance: any) => {
  //   editorCore.current = instance;
  //   if (!isJsonString(props.value)) {
  //     ReactEditorJS().blocks.renderFromHTML(props.value)
  //   }
  // }, []);

  const isJsonString = (str: string | undefined) => {
    if (!str) {
      return false;
    }

    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <>
      {!props.hideAlert && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          If you are experiencing any errors when copying the content from
          g-doc, please make sure to add the content to a text editor/note and
          copy it from there before submitting the statement.
        </Alert>
      )}
      <ReactEditorJS
        readOnly={props.disable}
        defaultValue={
          isJsonString(props.value)
            ? JSON.parse(props.value || "{blocks: []}")
            : { blocks: [] }
        }
        onInitialize={(core) => {
          // core.render
        }}
        onChange={(api, event) => {
          // only count block modifications and skip events like 'block-added' etc
          if (event.type !== "block-changed") {
            return;
          }

          function couldBeCounted(block: { data: any }) {
            return "text" in block.data;
          }

          function getBlocksTextLen(blocks: any[]) {
            return blocks.filter(couldBeCounted).reduce((sum, block) => {
              sum += block.data.text.length;

              return sum;
            }, 0);
          }

          api.saver.save().then((content: any) => {
            const contentLen = getBlocksTextLen(content.blocks);
            setLimit(contentLen);

            if (contentLen <= LIMIT) {
              setContent(JSON.stringify(content));
              return;
            }

            const workingBlock = event.detail.target;
            const workingBlockIndex = event.detail.index;
            const workingBlockSaved = content.blocks
              .filter((block: { id: any }) => block.id === workingBlock.id)
              .pop();
            const otherBlocks = content.blocks.filter(
              (block: { id: any }) => block.id !== workingBlock.id
            );
            const otherBlocksLen = getBlocksTextLen(otherBlocks);
            const workingBlockLimit = LIMIT - otherBlocksLen;
            if (workingBlockSaved) {
              api.blocks.update(workingBlock.id, {
                text: workingBlockSaved.data.text.substr(0, workingBlockLimit),
              });
            }

            api.caret.setToBlock(workingBlockIndex, "end");

            api.saver.save().then((savedData: any) => {
              setContent(JSON.stringify(savedData));
            });
          });
        }}
        
        placeholder={props.disable && isJsonString(props.value) ? "Data not available or not in correct format": "Enter your statement here"}
        tools={EDITOR_JS_TOOLS}
      />
      {!props.disable && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <span style={{ color: limit > LIMIT - 1000 ? "red" : "gray" }}>
            {limit}/{LIMIT}
          </span>
        </div>
      )}
    </>
  );
};

export default RichEditor;
