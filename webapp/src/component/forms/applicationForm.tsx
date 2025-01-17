import { useAppDispatch, useAppSelector, RootState } from "../../slices/store";
import { Button, Stack, TextField, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";

import { Grid, Typography, IconButton } from "@mui/material";
import { AppConfig } from "@config/config";
import RecommendationLine from "./components/recommendationLine";
import { useConfirmationModalContext } from "@context/dialogContext";

import { Link, useSearchParams } from "react-router-dom";

import RichTextField from "@component/forms/components/richEditor";
import {
  ApplicationSubmitDialog,
  RecommendationRequestDialog,
  SaveApplicationDialog,
  WithdrawApplicationDialog,
} from "@config/constant";

import {
  updateRecommendationStatement,
  requestLeadRecommendation,
  withdrawPromotionApplication,
  ApplicationState,
  savePromotionApplication,
  submitPromotionApplication,
} from "@slices/promotionSlice/promotion";

function ApplicationForm(props: { state: ApplicationState }) {

  const [searchParams, setSearchParams] = useSearchParams();
  
  const promotion = useAppSelector((state: RootState) => state.promotion);
  const recommendations = useAppSelector(
    (state: RootState) =>
      state.promotion.activePromotionCycle?.request?.recommendations
  );

  const dispatch = useAppDispatch();
  const dialogContext = useConfirmationModalContext();

  const getRecommendationLeadEmail = (index: number) => {
    return (recommendations && recommendations[index]?.leadEmail) || null;
  };

  const getRecommendationState = (index: number) => {
    return (
      (recommendations && recommendations[index]?.recommendationStatus) || null
    );
  };

  const checkIsSample = (index: number) => {
    return (recommendations && recommendations[index]?.isSample) || false;
  };

  const reportingLead = getRecommendationLeadEmail(0);
  const request = promotion.activePromotionCycle?.request;
  return (
    <>
      {request && (
        <Grid container spacing={1} className="form">
          <>
            {/* Application JobBand */}
            <Grid item xs={3} style={{ marginBottom: "10px" ,marginTop:"5px"}}>
              <Typography variant="h5">
                Job band of the promotion you are applying for:{" "}
              </Typography>
            </Grid>
            <Grid item xs={9} style={{ marginBottom: "25px" }}>
              <TextField
                name={"immediateLeadEmail"}
                size="small"
                disabled
                value={request.nextJobBand}
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
          </>

          {/* Check recommendation is valid  */}
          {recommendations && (
            <>
              {/* Reporting lead recommendation */}
              {reportingLead && (
                <>
                  <Grid item xs={3} style={{ marginBottom: "20px" ,marginTop:"5px"}}>
                    <Typography variant="h5">
                      Email ID for reporting lead recommendation:{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                  </Grid>

                  {/* Status and action  */}
                  <Grid item xs={9} style={{ marginBottom: "5px"}}>
                    <RecommendationLine
                      index={0}
                      isDirectLead={true}
                      action={() => {
                        dialogContext.showConfirmation(
                          RecommendationRequestDialog.title,
                          RecommendationRequestDialog.message,
                          () => {
                            dispatch(
                              requestLeadRecommendation({
                                index: 0,
                                requestId: request.id,
                                leadEmail: reportingLead || "",
                                isReportingLead: true,
                              })
                            );
                          },
                          RecommendationRequestDialog.okText
                        );
                      }}
                      leadEmail={reportingLead}
                      leadList={promotion.leadList}
                      isSample={false}
                      state={getRecommendationState(0)}
                    />
                  </Grid>
                </>
              )}

              {/* another team leads  */}
              <Grid item xs={3} style={{ marginBottom: "20px" ,marginTop: "5px" }}>
                <Typography
                  variant="h5"
                >
                  Email ID(s) for additional lead recommendation(s):
                  <span style={{ color: "red" }}> *</span>
                </Typography>
              </Grid>

              {/* Additional lead 1 */}
              <Grid item xs={9} style={{ marginBottom: "5px"}}>
                <RecommendationLine
                  exclude={recommendations.map(
                    (recommendation) => recommendation.leadEmail
                  )}
                  index={1}
                  isDirectLead={
                    false || request.status === ApplicationState.SUBMITTED
                  }
                  action={() => {
                    dialogContext.showConfirmation(
                      RecommendationRequestDialog.title,
                      RecommendationRequestDialog.message,
                      () => {
                        dispatch(
                          requestLeadRecommendation({
                            index: 1,
                            requestId: request.id,
                            leadEmail: getRecommendationLeadEmail(1) || "",
                            isReportingLead: false,
                          })
                        );
                      },
                      RecommendationRequestDialog.okText
                    );
                  }}
                  leadEmail={getRecommendationLeadEmail(1)}
                  leadList={promotion.leadList}
                  isSample={checkIsSample(1)}
                  state={getRecommendationState(1)}
                />
              </Grid>

              {/* Additional lead 2 */}
              <Grid item xs={3}></Grid>
              <Grid item xs={9} style={{ marginBottom: "5px"}}>
                <RecommendationLine
                  exclude={recommendations.map(
                    (recommendation) => recommendation.leadEmail
                  )}
                  index={2}
                  isDirectLead={
                    false || request.status === ApplicationState.SUBMITTED
                  }
                  action={() => {
                    dialogContext.showConfirmation(
                      RecommendationRequestDialog.title,
                      RecommendationRequestDialog.message,
                      () => {
                        dispatch(
                          requestLeadRecommendation({
                            index: 2,
                            requestId: request.id,
                            leadEmail: getRecommendationLeadEmail(2) || "",
                            isReportingLead: false,
                          })
                        );
                      },
                      RecommendationRequestDialog.okText
                    );
                  }}
                  leadEmail={getRecommendationLeadEmail(2)}
                  leadList={promotion.leadList}
                  isSample={checkIsSample(2)}
                  state={getRecommendationState(2)}
                />
              </Grid>

              {/* Additional lead 3 */}
              <Grid item xs={3}></Grid>
              <Grid item xs={9} style={{ marginBottom: "5px"}}>
                <RecommendationLine
                  exclude={recommendations.map(
                    (recommendation) => recommendation.leadEmail
                  )}
                  index={3}
                  isDirectLead={
                    false || request.status === ApplicationState.SUBMITTED
                  }
                  action={() => {
                    dialogContext.showConfirmation(
                      RecommendationRequestDialog.title,
                      RecommendationRequestDialog.message,
                      () => {
                        dispatch(
                          requestLeadRecommendation({
                            index: 3,
                            requestId: request.id,
                            leadEmail: getRecommendationLeadEmail(3) || "",
                            isReportingLead: false,
                          })
                        );
                      },
                      RecommendationRequestDialog.okText
                    );
                  }}
                  leadEmail={getRecommendationLeadEmail(3)}
                  leadList={promotion.leadList}
                  isSample={checkIsSample(3)}
                  state={getRecommendationState(3)}
                />
              </Grid>
            </>
          )}

          {/* Promotion Statement */}
          <Grid item xs={11}>
            <Typography
              // required
              variant="h5"
              style={{ marginTop: 10 }}
            >
              Tell us why you should get promoted (cover areas such as what you
              are doing now, the value you bring to the team, what you will
              achieve if promoted, etc):
              <label style={{ color: "red" }}>*</label>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <RichTextField
              disable={request.status === ApplicationState.SUBMITTED}
              onChange={(value) => {
                dispatch(updateRecommendationStatement({ value: value || "" }));
              }}
              value={request.promotionStatement}
            />
            
          </Grid>

          {/* Control buttons */}
          <Grid
            item
            xs={6}
            sx={{ display: "flex", flexDirection: "column-reverse" }}
          >
            {request.status === ApplicationState.DRAFT && (
              <Stack direction="row" spacing={2} marginBottom={"20px"}>
                <LoadingButton
                  size="large"
                  sx={{ boxShadow: "none" }}
                  onClick={() =>
                    dialogContext.showConfirmation(
                      SaveApplicationDialog.title,
                      SaveApplicationDialog.message,
                      () => {
                        if (promotion.activePromotionCycle?.request) {
                          dispatch(
                            savePromotionApplication({
                              id: request.id,
                              statement: request.promotionStatement,
                            })
                          );
                        }
                      },
                      SaveApplicationDialog.okText
                    )
                  }
                  variant="contained"
                  color="success"
                  disabled={promotion.isEmpty || !promotion.isModified}
                >
                  {"Save As Draft"}
                </LoadingButton>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ boxShadow: "none" }}
                  size="large"
                  onClick={() =>
                    dialogContext.showConfirmation(
                      ApplicationSubmitDialog.title,
                      ApplicationSubmitDialog.message,
                      () => {
                        dispatch(
                          submitPromotionApplication({
                            id: request.id,
                            statement: request.promotionStatement,
                          })
                        );
                      },
                      ApplicationSubmitDialog.okText
                    )
                  }
                  disabled={
                    promotion.isEmpty ||
                    !(
                      recommendations &&
                      recommendations.length > 1 &&
                      recommendations[0].recommendationStatus ===
                        ApplicationState.SUBMITTED &&
                      recommendations
                        .slice(1)
                        .filter(
                          (recommendation: {
                            recommendationStatus: ApplicationState;
                          }) =>
                            recommendation.recommendationStatus ===
                            ApplicationState.SUBMITTED
                        ).length > 0
                    )
                  }
                >
                  Submit
                </Button>
              </Stack>
            )}

            {request.status === ApplicationState.SUBMITTED && (
              <Stack direction="row" spacing={2} marginBottom={"20px"}>
                <LoadingButton
                  size="large"
                  onClick={() =>
                    dialogContext.showConfirmation(
                      WithdrawApplicationDialog.title,
                      WithdrawApplicationDialog.message,
                      () => {
                        if (promotion.activePromotionCycle?.request) {
                          dispatch(
                            withdrawPromotionApplication({
                              id: request.id,
                              redirect: () => {
                                searchParams.set("subView", "home");
                                setSearchParams(searchParams);
                              },
                            })
                          );
                        }
                      },
                      WithdrawApplicationDialog.okText
                    )
                  }
                  // loading={promotion.backgroundProcess}
                  variant="contained"
                  color="success"
                  sx={{ boxShadow: "none" }}
                >
                  {"Withdraw"}
                </LoadingButton>
              </Stack>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default ApplicationForm;
