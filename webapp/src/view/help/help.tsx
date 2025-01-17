import React from "react";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { doc} from "./doc";

export default function Administration(props: any) {
  return (
    <Grid item sx={{ m: 2 }}>
      <Paper
        square
        className="paper"
        variant="outlined"
        sx={{
          minHeight: "calc(800px)",
          borderRadius: "5px",
          minWidth: "1200px",
          height: "calc(100vh - 150px)",
        }}
      >
        <Grid item>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px",
            }}
          >
            <>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "left",
                }}
              >
                <IconButton
                  color="primary"
                  component="label"
                  onClick={() => {}}
                >
                  <ConstructionIcon />
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "7px", marginLeft: "10px" }}
                >
                  Help
                </Typography>
              </Grid>
              <Grid item></Grid>
            </>
          </Grid>

          <Box sx={{ p: "30px", pl:"50px"  }}>
            <MarkdownPreview  style={{ height: "calc(100vh - 300px)", minHeight: "calc(500px)" , overflow:"auto"}} source={doc} />
          </Box>
        </Grid>
      </Paper>
    </Grid>
  );
}
