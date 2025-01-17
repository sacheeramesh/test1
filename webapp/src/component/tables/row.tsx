import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";

import Alert from "@mui/material/Alert";
import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import RichTextField from "@component/forms/components/richEditor";
import { Header } from "./customTable";
import { ApplicationState, PromotionRequest } from "@utils/types";
import AlertTitle from "@mui/material/AlertTitle";

import PromotionTimeLine from "@component/promotion/timeline";
import UserImage from "@component/ui/userImage";
import {
  getPromotionRequestStatus,
  getRecommendationColor,
} from "@utils/utils";
import { Buffer } from "buffer";

function RequestRow(props: {
  rowColor?: string;
  setRowColor?: (request: PromotionRequest) => string;
  hideSelection?: boolean;
  headers: Header[];
  request: PromotionRequest;
  expand: number | null;
  setExpand: Dispatch<SetStateAction<number | null>>;
  checked: boolean;
  handleToggle: (value: number) => void;
}) {
  const renderCell = (header: Header, request: PromotionRequest) => {
    if (header.id !== "action") {
      var value = request[header.id];
      if (typeof value === "string") {
        return (
          <Tooltip
            title={header.formatter ? header.formatter(value, request) : value}
          >
            <Typography
              sx={{
                flex: 1,
                justifyContent: header.align,
                textAlign: header.align,
                wordWrap: "break-all",
              }}
            >
              {header.formatter ? header.formatter(value, request) : value}
            </Typography>
          </Tooltip>
        );
      } else if (!value) {
        return (
          <Tooltip title={"Data not available"}>
            <Typography
              sx={{
                flex: 1,
                justifyContent: header.align,
                textAlign: header.align,
                wordWrap: "break-all",
              }}
            >
              N/A
            </Typography>
          </Tooltip>
        );
      } else {
        return request[header.id];
      }
    } else {
      return (
        header.render &&
        header.render(request, (id) => {
          props.setExpand(id === props.expand ? null : id);
        })
      );
    }
  };

  const decodeBase64 = (base64String: String) => {
    const buffer = Buffer.from(base64String, "base64");
    return buffer.toString("utf-8");
  };

  return (
    <>
      <Box
        sx={{
          ...(!props.rowColor &&
            props.setRowColor && {
              backgroundColor: props.setRowColor(props.request),
            }),
          ...(props.rowColor && { backgroundColor: props.rowColor }),
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "auto",
          margin: "0 12px",
          border: "1px dashed #e3e3e3",
          ...(props.expand === props.request.id && {
            borderBottom: "none",
          }),

          p: 2,
          marginTop: "3px",
        }}
      >
        <Grid container spacing={2}>
          {!props.hideSelection && (
            <Grid
              item
              xs={0.3}
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={props.checked}
                onClick={() => props.handleToggle(props.request.id)}
              />
            </Grid>
          )}
          {props.headers.map((header, index) => {
            return (
              <Grid
                key={header.id}
                item
                xs={
                  props.hideSelection && header.id === "action"
                    ? header.width + 0.5
                    : header.width
                }
                sx={{
                  display: "flex",
                  justifyContent: header.align,
                  alignItems: "center",
                  overflowWrap: "anywhere",
                  padding: "0 10px",
                }}
              >
                <>{renderCell(header, props.request)}</>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Collapse in={props.expand === props.request.id}>
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",
            alignItems: "center",
            borderRadius: "0 0 5px 5px",
            height: "auto",
            margin: "0 12px",
            border:
              props.expand === props.request.id ? "1px dashed #e3e3e3" : "none",

            p: 2,
            marginBottom: "10px",
          }}
        >
          {(props.request.status === ApplicationState.FL_REJECTED ||
            props.request.status === ApplicationState.REJECTED) && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                height: "auto",
              }}
            >
              <Alert sx={{ width: "100%" }} severity="error">
                <AlertTitle>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Reason For Rejection
                  </Typography>
                </AlertTitle>
                <Typography variant="h6">
                  {props.request.reasonForRejection}
                </Typography>{" "}
              </Alert>
            </Box>
          )}
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
                <UserImage
                  email={props.request.employeeEmail}
                  size={150}
                  src={props.request.employeeImageUrl}
                  name={props.request.employeeEmail}
                  variant="circular"
                  isRound={true}
                />
              </Box>
            </Box>

            {/* Lead Recommendations */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "auto",
                paddingLeft: "20px",
                margin: "0px 10px",
                borderLeft: "1px lightgray dashed ",
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
                  Lead Recommendations
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  height: "350px",
                  paddingRight: "10px",
                  overflow: "auto",
                  textAlign: "justify",
                  flexDirection: "column",
                }}
              >
                {props.request.recommendations.length === 0 &&
                  "There are no leads recommendations."}
                {props.request.recommendations.length > 0 &&
                  props.request.recommendations.map(
                    (recommendations, index) => {
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
                            borderTop: "1px dashed lightgray",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              paddingRight: "10px",
                            }}
                          ></Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              paddingRight: "10px",
                              flex: 1,
                            }}
                          >
                            {/* Lead Email */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                height: "40px",
                                paddingRight: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "auto",
                                  width: "100px",
                                  justifyContent: "space-between",
                                  pr: "10px",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "400" }}
                                >
                                  Lead
                                </Typography>
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "600" }}
                                >
                                  :
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "auto",
                                  flex: 4,
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "600" }}
                                >
                                  {recommendations.leadEmail}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Status  */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                height: "40px",
                                paddingRight: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "auto",
                                  width: "100px",
                                  justifyContent: "space-between",
                                  pr: "10px",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "400" }}
                                >
                                  Status
                                </Typography>
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "600" }}
                                >
                                  :
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "auto",
                                  flex: 4,
                                }}
                              >
                                <Chip
                                  label={
                                    <Typography variant="h6">
                                      {getPromotionRequestStatus(
                                        recommendations.recommendationStatus
                                      )}
                                    </Typography>
                                  }
                                  sx={{
                                    marginTop: "-5px",
                                    background: getRecommendationColor(
                                      recommendations.recommendationStatus
                                    ),
                                    color: "white",
                                  }}
                                />
                              </Box>
                            </Box>

                            {/* Statement  */}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                minHeight: "40px",
                                paddingRight: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "auto",
                                  width: "100px",
                                  justifyContent: "space-between",
                                  pr: "10px",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "400" }}
                                >
                                  Additional Comment
                                </Typography>
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: "600" }}
                                >
                                  :
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "auto",
                                  flex: 4,
                                }}
                              >
                                <div
                                  style={{ font: "Ruda" }}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      recommendations.recommendationStatement
                                        ? decodeBase64(
                                            recommendations.recommendationStatement
                                          )
                                            .replace(/(<([^>]+)>)/gi, "")
                                            .trim() == ""
                                          ? `N/A`
                                          : decodeBase64(
                                              recommendations.recommendationStatement
                                            )
                                        : `N/A`,
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    }
                  )}
              </Box>
            </Box>

            {/* Employee Promotion History */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "auto",
                borderLeft: "1px lightgray dashed ",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  padding: "0px 20px",
                  height: "auto",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  Promotion History
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: "0px 20px",
                  height: "350px",
                  overflow: "auto",
                }}
              >
                {props.expand === props.request.id && (
                  <PromotionTimeLine
                    hideStatusImage={true}
                    employeeEmail={props.request.employeeEmail}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}

export default RequestRow;
