import { Stack, TextField, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";
import RichTextField from "@component/forms/components/richEditor";
import { Grid, Typography, IconButton } from "@mui/material";
import { AppConfig } from "@config/config";
import { Link } from "react-router-dom";

import { useConfirmationModalContext } from "@context/dialogContext";

import {
  ApplicationSubmitDialog,
  SaveApplicationDialog,
} from "@config/constant";

import { RecommendationState } from "@utils/types";

import {
  loadRequesterData,
  resetCurrentUser,
  saveRecommendation,
  setCurrentEdit,
  submitRecommendation,
} from "@slices/leadSlice";
import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import BackgroundLoader from "@component/common/backgroundLoader";
import { useEffect } from "react";
import UserImage from "@component/ui/userImage";
import { Buffer } from "buffer";

function RecommendationForm() {
  const lead = useAppSelector((state: RootState) => state.lead);
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const dialogContext = useConfirmationModalContext();

  var recommendation = lead.currentEditObject;

  useEffect(() => {
    if (!lead.currentUserData && lead.currentEditObject?.employeeEmail) {
      dispatch(loadRequesterData(lead.currentEditObject?.employeeEmail));
    }

    return () => {
      dispatch(resetCurrentUser());
    };
  }, [lead.currentUserData]);

  return (
    <>
      <BackgroundLoader
        open={lead.backgroundProcess}
        message={lead.backgroundProcessMessage}
      />

      {recommendation && (
        <Grid container spacing={1} className="form">
          <Grid
            container
            spacing={1}
            className="form"
            sx={{ paddingLeft: "10px" }}
          >
            <Grid
              container
              xs={6}
              direction={"row"}
              sx={{ paddingLeft: "10px", marginTop: "10px" }}
            >
              {/* Employee Info */}
              <Grid item xs={4} style={{ marginTop: "15px" }}>
                <Typography variant="h5">Applicant email:</Typography>
              </Grid>

              <Grid item xs={8} style={{ marginTop: "10px" }}>
                <TextField
                  name={"immediateLeadEmail"}
                  size="small"
                  disabled
                  value={recommendation.employeeEmail}
                  inputProps={{ "aria-label": "description" }}
                  style={{
                    width: 300,
                    justifyContent: "center",
                  }}
                />
              </Grid>

              {/* promotion job band */}
              <Grid item xs={4} style={{ marginTop: "15px" }}>
                <Typography variant="h5">
                  Job band of the recommended designation:
                </Typography>
              </Grid>

              <Grid item xs={8} style={{ marginTop: "10px" }}>
                <TextField
                  name={"immediateLeadEmail"}
                  size="small"
                  disabled
                  value={recommendation.promotingJobBand}
                  inputProps={{ "aria-label": "description" }}
                  style={{
                    width: 300,
                    justifyContent: "center",
                  }}
                />
                <Tooltip title="Job Band Info">
                  <IconButton
                    component={Link}
                    target="blank"
                    to={AppConfig.files.jobBandFile}
                    color="secondary"
                    aria-label="info"
                    sx={{ ml: 1 }}
                  >
                    <InfoIcon className="infoIcon" />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Employee Info */}
              <Grid item xs={4} style={{ marginTop: "15px" }}>
                <Typography variant="h5">Joined Date:</Typography>
              </Grid>

              <Grid item xs={8} style={{ marginTop: "10px" }}>
                <TextField
                  name={"immediateLeadEmail"}
                  size="small"
                  disabled
                  value={
                    lead.currentUserData?.startDate
                      ? lead.currentUserData?.startDate
                      : "N/A"
                  }
                  inputProps={{ "aria-label": "description" }}
                  style={{
                    width: 300,
                    justifyContent: "center",
                  }}
                />
              </Grid>

              <Grid item xs={4} style={{ marginTop: "15px" }}>
                <Typography variant="h5">Last Promoted Date:</Typography>
              </Grid>

              <Grid item xs={8} style={{ marginTop: "10px" }}>
                <TextField
                  name={"immediateLeadEmail"}
                  size="small"
                  disabled
                  value={
                    lead.currentUserData?.lastPromotedDate
                      ? lead.currentUserData?.lastPromotedDate
                      : "N/A"
                  }
                  inputProps={{ "aria-label": "description" }}
                  style={{
                    width: 300,
                    justifyContent: "center",
                  }}
                />
              </Grid>
            </Grid>

            <Grid
              container
              xs={6}
              direction={"row"}
              sx={{ paddingLeft: "10px", marginTop: "10px" }}
            >
              {" "}
              {lead.currentUserData && (
                <Grid item xs={12} sx={{ pb: "5px" }}>
                  <UserImage
                    email={lead.currentUserData.workEmail}
                    size={150}
                    name={""}
                    src={lead.currentUserData.employeeThumbnail}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Promotion Statement */}
          <Grid item xs={11} style={{ paddingTop: 20 }}>
            <Typography variant="h5">Additional comments</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <RichTextField
              disable={
                recommendation.recommendationStatus ===
                RecommendationState.SUBMITTED
              }
              onChange={(value) => {
                // to avoid warning
                if (recommendation) {
                  dispatch(
                    setCurrentEdit({
                      ...recommendation,
                      recommendationStatement: value,
                    })
                  );
                }
              }}
              value={recommendation.recommendationStatement || ""}
            />
          </Grid>

          {/* Control buttons */}
          <Grid
            item
            xs={6}
            sx={{ display: "flex", flexDirection: "column-reverse" }}
          >
            <Stack direction="row" spacing={2} marginBottom={"20px"}>
              <LoadingButton
                size="large"
                sx={{ boxShadow: "none" }}
                onClick={() =>
                  dialogContext.showConfirmation(
                    SaveApplicationDialog.title,
                    SaveApplicationDialog.message,
                    () => {
                      // pre conditions prevent this
                      if (recommendation?.recommendationStatement) {
                        dispatch(
                          saveRecommendation({
                            id: recommendation.recommendationID,
                            leadEmail: auth.userInfo?.email
                              ? auth.userInfo?.email
                              : "",
                            statement: Buffer.from(
                              recommendation?.recommendationStatement
                            ).toString("base64"),
                            comment: Buffer.from(
                              recommendation?.recommendationAdditionalComment ||
                                ""
                            ).toString("base64"),
                          })
                        );
                      }
                    },
                    SaveApplicationDialog.okText
                  )
                }
                variant="contained"
                disabled={recommendation.isEmpty || !recommendation.isModified}
              >
                {"Save As Draft"}
              </LoadingButton>
              <LoadingButton
                variant="contained"
                color="success"
                size="large"
                sx={{ boxShadow: "none" }}
                onClick={() =>
                  dialogContext.showConfirmation(
                    ApplicationSubmitDialog.title,
                    ApplicationSubmitDialog.message,
                    () => {
                      recommendation?.recommendationID &&
                        recommendation?.recommendationStatement &&
                        dispatch(
                          submitRecommendation({
                            id: recommendation.recommendationID,
                            leadEmail: auth.userInfo?.email
                              ? auth.userInfo?.email
                              : "",
                            statement: Buffer.from(
                              recommendation?.recommendationStatement
                            ).toString("base64"),
                            comment: Buffer.from(
                              recommendation?.recommendationAdditionalComment ||
                                ""
                            ).toString("base64"),
                          })
                        );
                    },
                    ApplicationSubmitDialog.okText
                  )
                }
                disabled={recommendation.isEmpty}
              >
                {"Approve"}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default RecommendationForm;
