import { useState } from "react";
import { Buffer } from "buffer";

import {
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  ExpandMore,
  Star,
  StarBorder,
} from "@mui/icons-material";

import { PromotionRequest, ApplicationState } from "@utils/types";

import {
  getApplicationColor,
  getPromotionRequestStatus,
  getPromotionRequestStatusWithActiveCycle,
} from "@utils/utils";

function PromotionRequestLine(props: {
  request: PromotionRequest;
  isActiveCycle: boolean;
}) {
  const [expand, setExpand] = useState(false);

  const decodeBase64 = (base64String: string) => {
    const binaryString = atob(base64String);

    // Convert the binary string back to a Uint8Array
    const utf8Bytes = Uint8Array.from(binaryString, (char) =>
      char.charCodeAt(0)
    );

    // Decode the UTF-8 bytes back to a Unicode string
    return new TextDecoder().decode(utf8Bytes);
  };

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
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{props.request.employeeEmail}</Typography>
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
                background: getApplicationColor(
                  getPromotionRequestStatusWithActiveCycle(
                    props.request.status,
                    props.isActiveCycle
                  )
                ),
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
              <IconButton
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                <ExpandMore />
              </IconButton>
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
                  marginTop: "20px",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Your Recommendation
                </Typography>
              </Box>

              {props.request.recommendations.map((recommendations) => {
                return (
                  <Box
                    key={recommendations.recommendationID}
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                      marginTop: "10px",
                      pt: "10px",
                      borderTop: "1px solid lightgray",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        height: "auto",
                        flex: 3,
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: recommendations.recommendationStatement
                            ? decodeBase64(
                                recommendations.recommendationStatement
                              )
                            : "N/A",
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          {/* Reason for the rejection */}
          {(props.request.status === ApplicationState.REJECTED ||
            props.request.status === ApplicationState.FL_REJECTED) && (
            <>
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
                      marginTop: "20px",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Reason For The Rejection
                    </Typography>
                  </Box>

                  {props.request.recommendations.map((recommendations) => {
                    return (
                      <Box
                        key={recommendations.recommendationID}
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          height: "auto",
                          marginTop: "10px",
                          pt: "10px",
                          borderTop: "1px solid lightgray",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            height: "auto",
                            flex: 3,
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: recommendations.reasonForRejection
                                ? recommendations.reasonForRejection
                                : "",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </Grid>
  );
}

export default PromotionRequestLine;
