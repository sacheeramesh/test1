// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { AppConfig } from "../../config/config";
import { EmployeeInfo, PromotionRequestType, SyncState } from "@utils/types";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";
import { SnackMessage, UIMessages } from "@config/constant";

export enum ApplicationState {
  REQUESTED = "REQUESTED",
  ACTIVE = "ACTIVE",
  SUBMITTED = "SUBMITTED",
  DRAFT = "DRAFT",
  DECLINED = "DECLINED",
  WITHDRAW = "WITHDRAW",
  REMOVED = "REMOVED",
}
interface EligibilityInterface {
  eligible: boolean;
  message: string;
}

interface ActivePromotionInterface {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  request: PromotionRequest | null;
}

interface initialDataInterface {
  userEligibility: EligibilityInterface | null;
  activePromotionCycle: ActivePromotionInterface | null;
  leadEmailList: string[];
}

interface PromotionRequest {
  currentJobBand: string;
  employeeEmail: string;
  id: number;
  promotionType: PromotionRequestType;
  nextJobBand: number;
  promotionCycle: string;
  promotionStatement: string;
  backupPromotionStatement: string;
  recommendations: RecommendationInterface[];
  status: ApplicationState;

  businessUnit: string;
  department: string;
  team: string;
  subTeam: string;
  joinDate: string;
  lastPromotedDate: string;
  location: string;

  currentJobRole: string;

  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

interface RecommendationInterface {
  leadEmail: string;
  recommendationID: number;
  recommendationStatus: ApplicationState;
  reportingLead: boolean;
  isSample: boolean;
}

interface PromotionState {
  state: "failed" | "success" | "loading" | "idle";
  syncState: SyncState;
  stateMessage: string | null;
  errorMessage: string | null;
  activePromotionCycle: ActivePromotionInterface | null;
  userEligibility: EligibilityInterface | null;
  leadList: string[];
  timeBasedRequests: PromotionRequest[];
  isModified: boolean;
  isEmpty: boolean;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

const initialState: PromotionState = {
  state: "idle",
  syncState: SyncState.IDLE,
  stateMessage: null,
  errorMessage: null,
  activePromotionCycle: null,
  userEligibility: null,
  leadList: [],
  timeBasedRequests: [],
  isModified: false,
  isEmpty: false,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const checkInitialData = createAsyncThunk(
  "promotion/checkInitialData",
  async (employeeEmail: string, { dispatch }) => {
    return new Promise<initialDataInterface>((resolve, reject) => {
      var data: initialDataInterface = {
        userEligibility: null,
        activePromotionCycle: null,
        leadEmailList: [],
      };
      dispatch(
        updateStateMessage(UIMessages.loading.checkActivePromotionCycle)
      );
      APIService.getInstance()
        .get<{ promotionCycles: ActivePromotionInterface[] }>(
          AppConfig.serviceUrls.getActivePromotionCycle
        )
        .then(
          (promotionCycleResponse) => {
            try {
              if (promotionCycleResponse.data.promotionCycles.length > 0) {
                data.activePromotionCycle =
                  promotionCycleResponse.data.promotionCycles[0];
                dispatch(
                  updateStateMessage(UIMessages.loading.checkEligibility)
                );
                Promise.all([
                  APIService.getInstance().get<EligibilityInterface>(
                    AppConfig.serviceUrls.userEligibilityCheck +
                      `?userEmail=${employeeEmail}`
                  ),
                  APIService.getInstance().get<{
                    employeeInfo: EmployeeInfo;
                  }>(
                    AppConfig.serviceUrls.getEmployeeHistory +
                      `?employeeWorkEmail=${employeeEmail}`
                  ),
                  APIService.getInstance().get<{
                    promotionRequests: PromotionRequest[];
                  }>(
                    AppConfig.serviceUrls.checkPromotionRequests +
                      data.activePromotionCycle.id +
                      `&employeeEmail=${employeeEmail}`
                  ),
                ])
                  .then(
                    ([
                      eligibilityCheckResponse,
                      employeeInfo,
                      checkPromotionRequestsResponse,
                    ]) => {
                      if (
                        eligibilityCheckResponse.status === 200 &&
                        checkPromotionRequestsResponse.status === 200 &&
                        checkPromotionRequestsResponse.data.promotionRequests
                      ) {
                        try {
                          data.userEligibility = eligibilityCheckResponse.data;

                          if (data.activePromotionCycle) {
                            if (
                              checkPromotionRequestsResponse.data
                                .promotionRequests[0] &&
                              employeeInfo.data.employeeInfo
                            ) {
                              let leadRecommendationFound: boolean =
                                checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.filter(
                                  (req: { reportingLead: any }) =>
                                    req.reportingLead
                                ).length === 0
                                  ? false
                                  : true;

                              if (
                                !leadRecommendationFound &&
                                employeeInfo.data.employeeInfo.reportingLead
                              ) {
                                checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.push(
                                  {
                                    leadEmail:
                                      employeeInfo.data.employeeInfo
                                        .reportingLead,
                                    recommendationID: 0,
                                    recommendationStatus:
                                      ApplicationState.DRAFT,
                                    reportingLead: true,
                                    isSample: true,
                                  }
                                );
                              }

                              // check recommendations list
                              let len =
                                checkPromotionRequestsResponse.data
                                  .promotionRequests[0].recommendations.length;

                              //adding sample data
                              if (len < 4) {
                                while (len < 4) {
                                  checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.push(
                                    {
                                      leadEmail: "",
                                      recommendationID: 0,
                                      recommendationStatus:
                                        ApplicationState.DRAFT,
                                      reportingLead: false,
                                      isSample: true,
                                    }
                                  );
                                  len += 1;
                                }
                              }

                              checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.sort(
                                function (x, y) {
                                  return x.reportingLead === y.reportingLead
                                    ? 0
                                    : x.reportingLead
                                    ? -1
                                    : 1;
                                }
                              );

                              data.activePromotionCycle.request =
                                checkPromotionRequestsResponse.data.promotionRequests[0];
                            } else {
                              data.activePromotionCycle.request = null;
                            }
                          }

                          resolve(data);
                        } catch (error) {
                          reject(error);
                        }
                      } else {
                        reject(eligibilityCheckResponse);
                      }
                    }
                  )
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                resolve(data);
              }
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
);

export const applyForPromotion = createAsyncThunk(
  "promotion/applyForPromotion",
  async (
    payload: {
      promotionId: number;
      employeeEmail: string;
      redirect: () => void;
    },
    { dispatch }
  ) => {
    return new Promise<{
      PromotionRequest: PromotionRequest | null;
      redirect: () => void;
    }>((resolve, reject) => {
      APIService.getInstance()
        .post(AppConfig.serviceUrls.applyPromotion, {
          PromotionCycleID: payload.promotionId,
          type: "NORMAL",
          employeeEmail: payload.employeeEmail,
        })
        .then((data) => {
          Promise.all([
            APIService.getInstance().get<{
              employeeInfo: EmployeeInfo;
            }>(
              AppConfig.serviceUrls.getEmployeeHistory +
                `employeeWorkEmail= ${payload.employeeEmail}`
            ),
            APIService.getInstance().get<{
              promotionRequests: PromotionRequest[];
            }>(
              AppConfig.serviceUrls.checkPromotionRequests +
                payload.promotionId +
                `&employeeEmail=${payload.employeeEmail}`
            ),
          ])
            .then(([employeeInfo, checkPromotionRequestsResponse]) => {
              if (
                checkPromotionRequestsResponse.status === 200 &&
                checkPromotionRequestsResponse.data.promotionRequests
              ) {
                try {
                  if (
                    checkPromotionRequestsResponse.data.promotionRequests[0] &&
                    employeeInfo.data.employeeInfo
                  ) {
                    let leadRecommendationFound: boolean =
                      checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.filter(
                        (req: { reportingLead: any }) => req.reportingLead
                      ).length === 0
                        ? false
                        : true;

                    if (
                      !leadRecommendationFound &&
                      employeeInfo.data.employeeInfo.reportingLead
                    ) {
                      checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.push(
                        {
                          leadEmail:
                            employeeInfo.data.employeeInfo.reportingLead,
                          recommendationID: 0,
                          recommendationStatus: ApplicationState.DRAFT,
                          reportingLead: true,
                          isSample: true,
                        }
                      );
                    }

                    // check recommendations list
                    let len =
                      checkPromotionRequestsResponse.data.promotionRequests[0]
                        .recommendations.length;

                    //adding sample data
                    if (len < 4) {
                      while (len < 4) {
                        checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.push(
                          {
                            leadEmail: "",
                            recommendationID: 0,
                            recommendationStatus: ApplicationState.DRAFT,
                            reportingLead: false,
                            isSample: true,
                          }
                        );
                        len += 1;
                      }
                    }

                    checkPromotionRequestsResponse.data.promotionRequests[0].recommendations.sort(
                      function (x, y) {
                        return x.reportingLead === y.reportingLead
                          ? 0
                          : x.reportingLead
                          ? -1
                          : 1;
                      }
                    );
                  }

                  resolve({
                    PromotionRequest:
                      checkPromotionRequestsResponse.data
                        .promotionRequests[0] || null,
                    redirect: payload.redirect,
                  });
                } catch (error) {
                  reject(error);
                }
              } else {
                reject(checkPromotionRequestsResponse);
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to approve promotion request",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const savePromotionApplication = createAsyncThunk(
  "promotion/savePromotionApplication",
  async (
    payload: { id: number; statement?: string; promotingJobBand?: number },
    { dispatch }
  ) => {
    return new Promise((resolve, reject) => {
      APIService.getInstance()
        .patch(AppConfig.serviceUrls.savePromotionApplication, payload)
        .then((resp) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.saveApplication,
              type: "success",
            })
          );
          resolve(resp.data);
        })
        .catch(
          (
            error: AxiosError<{
              message?: string;
            }>
          ) => {
            console.log(error);
            dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data?.message)
                    : "Unable to save promotion request",
                type: "error",
              })
            );
            reject(error);
          }
        );
    });
  }
);

export const submitPromotionApplication = createAsyncThunk(
  "promotion/submitPromotionApplication",
  async (payload: { id: number; statement: string }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      APIService.getInstance()
        .patch(AppConfig.serviceUrls.savePromotionApplication, payload)
        .then((resp) => {
          APIService.getInstance()
            .get(
              AppConfig.serviceUrls.savePromotionApplication +
                `/${payload.id}/submit`
            )
            .then((resp) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: SnackMessage.success.submitApplication,
                  type: "success",
                })
              );
              resolve(resp.data);
            })
            .catch((error: AxiosError) => {
              dispatch(
                enqueueSnackbarMessage({
                  message:
                    error.response?.status === 500
                      ? String(error.response?.data)
                      : "Unable to submit promotion request",
                  type: "error",
                })
              );
              reject(error);
            });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to submit promotion request",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const requestLeadRecommendation = createAsyncThunk(
  "promotion/requestLeadRecommendation",
  async (
    payload: {
      leadEmail: string;
      isReportingLead: boolean;
      requestId: number;
      index: number;
    },
    { dispatch }
  ) => {
    return new Promise<{
      index: number;
      leadEmail: string;
      isReportingLead: boolean;
    }>((resolve, reject) => {
      APIService.getInstance()
        .post(AppConfig.serviceUrls.requestRecommendation, payload)
        .then((resp) => {
          dispatch({
            type: "common/enqueueSnackbarMessage",
            payload: {
              message: "Successfully requested the recommendation",
              type: "success",
            },
          });
          resolve({
            index: payload.index,
            leadEmail: payload.leadEmail,
            isReportingLead: payload.isReportingLead,
          });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to request the lead recommendation",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const withdrawPromotionApplication = createAsyncThunk(
  "promotion/withdrawPromotionApplication",
  async (payload: { id: number; redirect: () => void }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      APIService.getInstance()
        .get(
          AppConfig.serviceUrls.savePromotionApplication +
            `/${payload.id}/withdraw`
        )
        .then((resp) => {
          payload.redirect();
          resolve(resp.data);
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to request the withdrawal",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const getTimeBasedPromotion = createAsyncThunk(
  "promotion/getTimeBasedPromotion",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "?type=TIME_BASED&statusArray=DRAFT"
          )
          .then((resp) => {
            resolve(resp.data);
          })
          .catch((error: AxiosError) => {
            dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data)
                    : "Unable to get time-based promotion requests",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const timeBasedPromotion = createAsyncThunk(
  "promotion/timeBasedPromotion",
  async (
    payload: {
      type: string;
      sheet: string;
    },
    { dispatch }
  ) => {
    return new Promise((resolve, reject) => {
      APIService.getInstance()
        .post(AppConfig.serviceUrls.timeBasedPromotion, payload)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error: any) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data.message)
                  : "Unable to process time based promotions",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const checkSyncState = createAsyncThunk(
  "promotion/checkSyncStatus",
  async (_, { dispatch }) => {
    return new Promise<{ state: SyncState }>((resolve, reject) => {
      APIService.getInstance()
        .get(
          AppConfig.serviceUrls.getConfigs + "?key=TIME_BASED_PROMOTION_STATE"
        )
        .then((resp) => {
          if (
            resp.status === 200 &&
            resp.data.appConfigs &&
            resp.data.appConfigs.length > 0
          ) {
            resolve({ state: resp.data.appConfigs[0].value as SyncState });
          } else {
            dispatch(
              enqueueSnackbarMessage({
                message: "Unable to read configurations",
                type: "error",
              })
            );
          }
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to read configurations",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const PromotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    updateStateMessage: (state, action: PayloadAction<string>) => {
      state.stateMessage = action.payload;
    },

    updateRecommendationLeadEmail: (
      state,
      action: PayloadAction<{ leadEmail: string; index: number }>
    ) => {
      const recommendations =
        state.activePromotionCycle?.request?.recommendations;
      if (
        recommendations &&
        state.activePromotionCycle?.request &&
        recommendations[action.payload.index]
      ) {
        recommendations[action.payload.index].leadEmail =
          action.payload.leadEmail;
        state.activePromotionCycle = {
          ...state.activePromotionCycle,
          request: {
            ...state.activePromotionCycle?.request,
            recommendations,
          },
        };
      }
    },

    updateRecommendationStatement: (
      state,
      action: PayloadAction<{ value: string }>
    ) => {
      if (state.activePromotionCycle?.request) {
        const backupPromotionStatement =
          state.activePromotionCycle?.request.backupPromotionStatement || "";
        let promotionStatement = action.payload.value;

        state.activePromotionCycle = {
          ...state.activePromotionCycle,
          request: {
            ...state.activePromotionCycle?.request,
            promotionStatement,
          },
        };

        const currentStatement = action.payload.value;
        const backupStatement = backupPromotionStatement;
        const isChanged = backupStatement !== currentStatement;
        state.isModified = isChanged;
        state.isEmpty = currentStatement === "<p></p>";
      }
    },

    resetStatementChange: (state) => {
      if (state.activePromotionCycle?.request) {
        const backupPromotionStatement =
          state.activePromotionCycle?.request.backupPromotionStatement || "";
        const backupStatement = backupPromotionStatement.replace(
          /<\/?[^>]+(>|$)/g,
          ""
        );

        state.activePromotionCycle.request.promotionStatement =
          state.activePromotionCycle.request.backupPromotionStatement;

        state.isEmpty = backupStatement === "";
      }

      state.isModified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkInitialData.pending, (state, action) => {
        state.state = "loading";
        state.stateMessage = "Checking Promotion Details";
      })
      .addCase(checkInitialData.fulfilled, (state, action) => {
        if (action.payload.activePromotionCycle?.request) {
          action.payload.activePromotionCycle.request.backupPromotionStatement =
            action.payload.activePromotionCycle.request.promotionStatement ||
            "";

          state.isEmpty =
            action.payload.activePromotionCycle.request
              .backupPromotionStatement === "";
        }
        state.activePromotionCycle = action.payload.activePromotionCycle;
        state.userEligibility = action.payload.userEligibility;
        state.leadList = action.payload.leadEmailList;
        state.state = "success";
        state.stateMessage = null;
      })
      .addCase(checkInitialData.rejected, (state, payload) => {
        state.state = "failed";
        state.stateMessage = null;
        state.leadList = [];
      })
      .addCase(requestLeadRecommendation.pending, (state) => {
        state.backgroundProcessMessage = "Requesting the lead recommendation";
        state.backgroundProcess = true;
      })
      .addCase(requestLeadRecommendation.fulfilled, (state, action) => {
        state.backgroundProcess = false;

        const recommendations =
          state.activePromotionCycle?.request?.recommendations;
        if (
          recommendations &&
          state.activePromotionCycle?.request &&
          recommendations[action.payload.index]
        ) {
          recommendations[action.payload.index].recommendationStatus =
            ApplicationState.REQUESTED;
          recommendations[action.payload.index].isSample = false;
          state.activePromotionCycle = {
            ...state.activePromotionCycle,
            request: {
              ...state.activePromotionCycle?.request,

              recommendations,
            },
          };
        }
      })
      .addCase(requestLeadRecommendation.rejected, (state, action) => {
        state.backgroundProcess = false;
        // TODO : need to handle error
      })
      //saving application
      .addCase(savePromotionApplication.pending, (state, action) => {
        state.state = "loading";
        state.backgroundProcessMessage = "Saving Application";
        state.backgroundProcess = true;
      })
      .addCase(savePromotionApplication.fulfilled, (state, action) => {
        state.state = "success";
        if (state.activePromotionCycle?.request) {
          state.activePromotionCycle.request.backupPromotionStatement =
            state.activePromotionCycle.request.promotionStatement;
        }
        state.isModified = false;
        state.isEmpty = false;
        state.backgroundProcess = false;
      })
      .addCase(savePromotionApplication.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      //Submitting application
      .addCase(submitPromotionApplication.pending, (state, action) => {
        state.backgroundProcessMessage = "Submitting Application";
        state.backgroundProcess = true;
      })
      .addCase(submitPromotionApplication.fulfilled, (state, action) => {
        if (state.activePromotionCycle?.request) {
          state.activePromotionCycle.request.status =
            ApplicationState.SUBMITTED;
        }
        state.isModified = false;
        state.isEmpty = false;
        state.backgroundProcess = false;
      })
      .addCase(submitPromotionApplication.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      //Submitting application
      .addCase(withdrawPromotionApplication.pending, (state, action) => {
        state.backgroundProcessMessage = "Withdrawing Application";
        state.backgroundProcess = true;
      })
      .addCase(withdrawPromotionApplication.fulfilled, (state, action) => {
        if (state.activePromotionCycle?.request) {
          state.activePromotionCycle.request.status = ApplicationState.WITHDRAW;
        }
        state.isModified = false;
        state.isEmpty = false;
        state.backgroundProcess = false;
      })
      .addCase(withdrawPromotionApplication.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // Refreshing ----------------------------
      .addCase(applyForPromotion.pending, (state, action) => {
        state.backgroundProcessMessage = "Creating a draft application";
        state.backgroundProcess = true;
      })
      .addCase(applyForPromotion.fulfilled, (state, action) => {
        if (state.activePromotionCycle) {
          var recommendations =
            action.payload.PromotionRequest?.recommendations;
          if (recommendations) {
            // check recommendations list
            let len = recommendations.length;

            //adding sample data
            if (len < 4) {
              while (len < 4) {
                action.payload.PromotionRequest?.recommendations.push({
                  leadEmail: "",
                  recommendationID: 0,
                  recommendationStatus: ApplicationState.DRAFT,
                  reportingLead: false,
                  isSample: true,
                });
                len += 1;
              }
            }
          }

          state.activePromotionCycle.request = action.payload.PromotionRequest;
          action.payload.redirect();
        }

        state.backgroundProcess = false;
      })
      .addCase(applyForPromotion.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      .addCase(getTimeBasedPromotion.pending, (state, action) => {
        state.stateMessage = "Loading Time Based Promotions";
        state.state = "loading";
      })
      .addCase(getTimeBasedPromotion.fulfilled, (state, action) => {
        state.timeBasedRequests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getTimeBasedPromotion.rejected, (state, action) => {
        state.state = "failed";
      })

      .addCase(timeBasedPromotion.pending, (state, action) => {
        state.state = "loading";
        state.stateMessage = "Processing Time Based Promotions";
        state.backgroundProcessMessage = "Processing time based promotions";
        state.backgroundProcess = true;
      })
      .addCase(timeBasedPromotion.fulfilled, (state, action) => {
        state.state = "success";
        state.isModified = false;
        state.isEmpty = false;
        state.backgroundProcess = false;
      })
      .addCase(timeBasedPromotion.rejected, (state, action) => {
        state.state = "success";
        state.backgroundProcess = false;
      })
      // Sync State Checker
      .addCase(checkSyncState.pending, (state) => {})
      .addCase(checkSyncState.fulfilled, (state, action) => {
        if (
          !(
            state.syncState === SyncState.IDLE &&
            action.payload.state === SyncState.SUCCESS
          )
        ) {
          state.syncState = action.payload.state;
        }
      })
      .addCase(checkSyncState.rejected, (state) => {});
  },
});

export const {
  updateRecommendationLeadEmail,
  updateRecommendationStatement,
  updateStateMessage,
} = PromotionSlice.actions;

export default PromotionSlice.reducer;
