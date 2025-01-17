import React from "react";

import { Box, ButtonGroup, IconButton, Tooltip } from "@mui/material";
import { Cached } from "@mui/icons-material";

function PanelHeader(props: {
  refresh?: () => void;
  header?: React.ReactNode;
}) {
  return (
    <Box
      className="panel-con"
      sx={{
        height: "40px",
        width:"100%",
        marginBottom: "0px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {props.header && <div>{props.header}</div>}

      <ButtonGroup>
        {props.refresh && (
          <Tooltip title={"Refresh Page"}>
            <IconButton
              size="small"
              onClick={() => {
                props.refresh && props.refresh();
              }}
            >
              <Cached />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </Box>
  );
}

export default PanelHeader;
