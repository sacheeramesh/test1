import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { RecommendationState, RecommendationInterface } from "@utils/types";
import { setCurrentEdit, declineRecommendation } from "@slices/leadSlice";
import { useAppDispatch } from "@slices/store";

import { useState } from "react";

import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { PromotionType } from "@config/config";

function RecommendationLine(props: {
  recommendation: RecommendationInterface;
}) {
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState("");

  return (
    <Grid item xs={12} key={props.recommendation?.recommendationID}>
      <Box
        sx={{
          display: "flex",
          margin: "0 12px",
          flexDirection: "row",
          border: "1px dashed #e3e3e3",
          p: 2,
          marginBottom: "10px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ mr: "10px" }}>
              {props.recommendation?.employeeName}
            </Typography>
            {/* Removed form new promotion process */}
            {/* {props.recommendation.reportingLead ? (
              <Chip
                sx={{ background: "#36B37E", color: "white" }}
                label={<Typography variant="h6">Direct</Typography>}
                size="small"
              />
            ) : (
              ""
            )} */}
            {/* Promotion type */}
            {props.recommendation.promotionType == PromotionType.TIME_BASED ? (
              <Chip
                sx={{ background: "#36B37E", color: "white" }}
                label={<Typography variant="h6">Time Based</Typography>}
                size="small"
              />
            ) : (
              ""
            )}
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
            <Typography variant="h5">
              {props.recommendation?.promotionCycle}
            </Typography>
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
            <Typography variant="h5">
              {props.recommendation?.employeeEmail}
            </Typography>
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            {props.recommendation.recommendationStatus ===
              RecommendationState.REQUESTED && (
              <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
                <Button
                  variant="contained"
                  style={{
                    background: "#172B4D",
                    boxShadow: "none",
                    color: "white",
                  }}
                  onClick={() => {
                    dispatch(
                      setCurrentEdit({
                        ...props.recommendation,
                        statementBackup:
                          props.recommendation.recommendationStatement,
                        additionalCommentBackup:
                          props.recommendation.recommendationAdditionalComment,
                        isModified: false,
                        isEmpty: false,
                      })
                    );
                  }}
                >
                  Start
                </Button>

                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <>
                      <Button
                        {...bindTrigger(popupState)}
                        variant="contained"
                        style={{
                          background: "#DE350B",
                          boxShadow: "none",
                          color: "white",
                        }}
                      >
                        Decline
                      </Button>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <div style={{ padding: "20px" }}>
                          <TextField
                            fullWidth
                            label="Reason for decline"
                            multiline
                            inputProps={{ maxLength: 250 }}
                            maxRows={6}
                            onChange={(value) => setComment(value.target.value)}
                          />
                          <Typography variant="h6" color="gray" sx={{ mt: 1 }}>
                            {comment.length}/250{" "}
                          </Typography>

                          <div
                            style={{
                              margin: "0px",
                              marginTop: "5px",
                              display: "flex",
                              justifyContent: "right",
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setComment("");
                                popupState.close();
                              }}
                            >
                              Close
                            </Button>
                            <Button
                              color="success"
                              sx={{ marginLeft: "10px" }}
                              disabled={comment === ""}
                              variant="contained"
                              onClick={() => {
                                dispatch(
                                  declineRecommendation({
                                    id: props.recommendation.recommendationID,
                                    comment: comment,
                                    leadEmail: props.recommendation.leadEmail,
                                  })
                                );
                                setComment("");
                                popupState.close();
                              }}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </Popover>
                    </>
                  )}
                </PopupState>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default RecommendationLine;
