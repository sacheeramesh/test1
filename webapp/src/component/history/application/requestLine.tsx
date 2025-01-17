import {
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { ArrowForward, ExpandMore } from "@mui/icons-material";

import { PromotionRequest } from "@utils/types";

import { useState } from "react";
import {
  getApplicationColor,
  getPromotionRequestStatusWithActiveCycle,
} from "@utils/utils";
import RichTextField from "@component/forms/components/richEditor";

function PromotionRequestLine(props: {
  request: PromotionRequest;
  isActiveCycle: boolean;
}) {
  const [expand, setExpand] = useState(false);

  return (
    <Grid item xs={12} key={props.request.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          // borderRadius: expand ? "10px 10px 0 0" : "10px",
          height: "auto",
          margin: "0 12px",
          border: "1px dashed #e3e3e3",
          p: 2,
          marginTop: "3px",
          // marginBottom: "10px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{props.request.promotionCycle}</Typography>
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chip
              label={
                <Typography variant="h6">
                  {props.request.promotionType}
                </Typography>
              }
              sx={{
                m: "2px",

                background:
                  props.request.promotionType === "NORMAL"
                    ? "#36B37E"
                    : "#6554C0",
              }}
            />
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chip
              label={
                <Typography variant="h6">
                  {getPromotionRequestStatusWithActiveCycle(
                    props.request.status,
                    props.isActiveCycle
                  )}
                </Typography>
              }
              sx={{
                m: "2px",
                background: getApplicationColor(props.request.status),
                color: "white",
              }}
            />
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chip
              label={
                <Typography variant="h6">
                  JB {props.request.currentJobBand}
                </Typography>
              }
              sx={{ m: "2px", background: "light-gray" }}
            />
            <ArrowForward />

            <Chip
              label={
                <Typography variant="h6">
                  JB {props.request.nextJobBand}
                </Typography>
              }
              sx={{ m: "2px", background: "light-gray" }}
            />
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
              {props.request.promotionType === "NORMAL" && (
                <IconButton
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  <ExpandMore />
                </IconButton>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Collapse in={expand}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: "0 0 5px 5px",
            height: "auto",
            margin: "0 12px",
            border: expand ? "1px dashed #e3e3e3" : "none",
            p: 2,
            marginBottom: "10px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",

              height: "auto",
              p: 2,
              marginBottom: "10px",
            }}
          >
            {/* Request */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "auto",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  height: "auto",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  Request Statement
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                }}
              >
                <RichTextField
                  value={props.request.promotionStatement}
                  disable={true}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Grid>
  );
}

export default PromotionRequestLine;
