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
  useTheme,
} from "@mui/material";

import {
  ArrowForward,
  Check,
  Close,
  ExpandMore,
  Star,
  StarBorder,
} from "@mui/icons-material";

import {
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} from "@slices/adminSlices/withdrawalRequests";
import { RootState, useAppSelector, useAppDispatch } from "@slices/store";

import { useConfirmationModalContext } from "@context/dialogContext";
import { PromotionRequest } from "../../slices/adminSlices/withdrawalRequests";
import { ApplicationState } from "@utils/types";

function WithdrawalRequestLine(props: { request: PromotionRequest }) {
  const dispatch = useAppDispatch();
  const admin_users = useAppSelector((state: RootState) => state.admin_users);
  const theme = useTheme()
  const [expand, setExpand] = useState(false);

  const dialogContext = useConfirmationModalContext();

  const decodeBase64 = (base64String: String) => {
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
  };

  return (
    <Grid item xs={12} key={props.request.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "auto",
          margin: "0 12px",
          border: "1px dashed #e3e3e3",
          ...(props.request.status === ApplicationState.REMOVED && {
            backgroundColor:
              theme.palette.mode === "light" ? "#ffe6e6" : "#DE350B"
          }),
          p: 2,
          marginBottom: "10px",
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
                <Typography variant="h5">
                  JB {props.request.currentJobBand}
                </Typography>
              }
              sx={{ m: "2px", background: "light-gray" }}
            />
            <ArrowForward />

            <Chip
              label={
                <Typography variant="h5">
                  JB {props.request.nextJobBand}
                </Typography>
              }
              sx={{ m: "2px", background: "light-gray" }}
            />
          </Grid>
          <Grid
            item
            xs={5}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            {props.request.status === ApplicationState.REMOVED && (
              <Typography
                variant={"h5"}
                sx={{ margin: "0px 20px", color: "#BF2600" }}
              >
                Approved
              </Typography>
            )}
            <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
              {props.request.status === ApplicationState.WITHDRAW && (
                <>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      dialogContext.showConfirmation(
                        "Are you sure?",
                        <>
                          Do you want to <b>approve</b> this withdrawal request?{" "}
                        </>,
                        () => {
                          dispatch(approveWithdrawalRequest(props.request.id));
                        },
                        "approve"
                      );
                    }}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => {
                      dialogContext.showConfirmation(
                        "Are you sure?",
                        <>
                          Do you want to <b>reject</b> this withdrawal request?{" "}
                        </>,
                        () => {
                          dispatch(rejectWithdrawalRequest(props.request.id));
                        },
                        "reject"
                      );
                    }}
                  >
                    <Close />
                  </IconButton>
                </>
              )}
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
            // background: "lightgray",
            flexDirection: "row",
            alignItems: "center",
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
              flexDirection: "column",

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
                flexDirection: "row",
                height: "auto",
              }}
            >
              <Typography variant="h5">
                <b>Request</b>
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
                  __html: props.request.promotionStatement
                  ? decodeBase64(props.request.promotionStatement)
                  : ""
                }}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                height: "auto",
                marginTop: "20px",
              }}
            >
              <Typography variant="h5">
                <b>Recommendations</b>
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
                    borderTop: "1px solid gray",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      height: "auto",
                      flex: 1,
                    }}
                  >
                    {recommendations.leadEmail}
                  </Box>
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
                          ? decodeBase64(recommendations.recommendationStatement)
                          : ""
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      height: "auto",
                      flex: 1,
                    }}
                  >
                    <b>{recommendations.recommendationStatus}</b>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Collapse>
    </Grid>
  );
}

export default WithdrawalRequestLine;
