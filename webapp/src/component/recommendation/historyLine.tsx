import { useState } from "react";
import {Buffer} from 'buffer';
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

import {
  ApplicationState,
  RecommendationInterface,
  RecommendationState,
} from "@utils/types";

import {
  getApplicationColor,
  getPromotionRequestStatusWithActiveCycle,
  getRecommendationColor,
} from "@utils/utils";

function RecommendationLine(props: {
  recommendation: RecommendationInterface;
  isActiveCycle: boolean;
}) {
  const [expand, setExpand] = useState(false);

  const decodeBase64 = (base64String: String) => {
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
  };

  return (
    <Grid item xs={12} key={props.recommendation.recommendationID}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: expand ? "10px 10px 0 0" : "10px",
          height: "auto",
          margin: "0 12px",
          border: "1px dashed #e3e3e3",
          p: 2,
          marginTop: "3px",
          marginBottom: "10px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <>
              <Typography variant="h5">
                {props.recommendation?.employeeName}
              </Typography>
              &nbsp;&nbsp;
            </>
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
            <Typography variant="h5">
              {props.recommendation.employeeEmail}
            </Typography>
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
            <Typography variant="h5">
              {props.recommendation.promotionCycle}
            </Typography>
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
                  {props.recommendation.recommendationStatus}
                </Typography>
              }
              sx={{
                m: "2px",
                background: getRecommendationColor(
                  props.recommendation.recommendationStatus
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
                  {getPromotionRequestStatusWithActiveCycle(
                    props.recommendation.promotionRequestStatus,
                    props.isActiveCycle
                  )}
                </Typography>
              }
              sx={{
                m: "2px",
                background: getApplicationColor(
                  getPromotionRequestStatusWithActiveCycle(
                    props.recommendation.promotionRequestStatus,
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
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
              {(props.recommendation.recommendationStatus ===
                RecommendationState.DECLINED ||
                RecommendationState.SUBMITTED) && (
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
              {props.recommendation.recommendationStatus ===
                RecommendationState.SUBMITTED && (
                <>
                  {" "}
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                    }}
                  >
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                      Your Recommendation
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      mb: 2,
                      height: "auto",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          props.recommendation.recommendationStatement 
                          ? decodeBase64(props.recommendation.recommendationStatement)
                          : "N/A"
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                    }}
                  >
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                      Additional Comment
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          props.recommendation.recommendationAdditionalComment 
                          ? decodeBase64(props.recommendation.recommendationAdditionalComment)
                          : "N/A"
                      }}
                    />
                  </Box>
                  {/* Reason for Rejection */}
                  {props.recommendation.promotionRequestStatus ===
                    ApplicationState.REJECTED ||
                  props.recommendation.promotionRequestStatus ===
                    ApplicationState.FL_REJECTED ? (
                    <>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          height: "auto",
                        }}
                      >
                        <Typography variant="h5" style={{ fontWeight: 700 }}>
                          Reason for the Rejection
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          height: "auto",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: props.recommendation.reasonForRejection
                            ? decodeBase64(props.recommendation.reasonForRejection)
                            : "N/A"
                          }}
                        />
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {props.recommendation.recommendationStatus ===
                RecommendationState.DECLINED && (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                    }}
                  >
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                      Reason for Decline
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: props.recommendation.recommendationAdditionalComment
                        ? decodeBase64(props.recommendation.recommendationAdditionalComment)
                        : "N/A"
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Grid>
  );
}

export default RecommendationLine;
