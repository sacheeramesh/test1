import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";
import { SnackMessage } from "@config/constant";
import { EmployeeInfo, RecommendationInterface } from "@utils/types";
import { StringLocale } from "yup/lib/locale";

export interface EditObjInterface extends RecommendationInterface {
  statementBackup: string | null;
  additionalCommentBackup: string | null;
  isModified: boolean;
  isEmpty: boolean;
}

export interface LeadState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  recommendations: RecommendationInterface[];
  errorMessage: string | null;
  backgroundProcess: boolean;
  currentUserData: EmployeeInfo | null;
  activePromotionCycle: ActivePromotionCycleInterface | null;
  backgroundProcessMessage: string | null;
  currentEditObject: EditObjInterface | null;
}

const initialState: LeadState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  recommendations: [],
  currentUserData: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
  activePromotionCycle: null,
  currentEditObject: null,
};

interface ActivePromotionCycleInterface {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export const loadRequesterData = createAsyncThunk(
  "lead/loadRequesterData",
  async (email: string, { dispatch }) => {
    return new Promise<{
      employeeInfo: EmployeeInfo;
    }>((resolve, reject) => {
      APIService.getInstance()
        .get<{
          employeeInfo: EmployeeInfo;
        }>(
          AppConfig.serviceUrls.getEmployeeHistory +
            "?employeeWorkEmail=" +
            email
        )
        .then((resp) => {
          resolve({
            employeeInfo: resp.data.employeeInfo,
          });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to load requester data",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const getAllRecommendationsWithActivePromoCycle = createAsyncThunk(
  "lead/getActiveRecommendation",
  async (leadEmail: string, { dispatch }) => {
    return new Promise<{
      recommendations: RecommendationInterface[];
      promotionCycle: ActivePromotionCycleInterface | null;
    }>((resolve, reject) => {
      Promise.all([
        APIService.getInstance().get<{
          recommendations: RecommendationInterface[];
        }>(
          AppConfig.serviceUrls.getPromotionRecommendations +
            "?leadEmail=" +
            leadEmail +
            "&statusArray=REQUESTED"
        ),
        APIService.getInstance().get<{
          promotionCycles: ActivePromotionCycleInterface[];
        }>(AppConfig.serviceUrls.getActivePromotionCycle),
      ])
        .then(([recommendationResponse, promotionCycleResponse]) => {
          resolve({
            promotionCycle:
              promotionCycleResponse.data.promotionCycles.length > 0
                ? promotionCycleResponse.data.promotionCycles[0]
                : null,
            recommendations: recommendationResponse.data.recommendations,
          });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to load recommendations",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const saveRecommendation = createAsyncThunk(
  "lead/saveRecommendation",
  async (
    payload: {
      id: number;
      statement: string;
      comment: string | null;
      leadEmail: string;
    },
    { dispatch }
  ) => {
    return new Promise<{
      recommendations: RecommendationInterface[];
      promotionCycle: ActivePromotionCycleInterface | null;
      statement: string;
      comment: string | null;
    }>((resolve, reject) => {
      APIService.getInstance()
        .patch<{ status: string }>(
          AppConfig.serviceUrls.savePromotionRecommendation,
          payload
        )
        .then((resp) => {
          Promise.all([
            APIService.getInstance().get<{
              recommendations: RecommendationInterface[];
            }>(
              AppConfig.serviceUrls.getPromotionRecommendations +
                "?leadEmail=" +
                payload.leadEmail +
                "&statusArray=REQUESTED"
            ),
            APIService.getInstance().get<{
              promotionCycles: ActivePromotionCycleInterface[];
            }>(AppConfig.serviceUrls.getActivePromotionCycle),
          ])
            .then(([recommendationResponse, promotionCycleResponse]) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: SnackMessage.success.saveRecommendation,
                  type: "success",
                })
              );
              resolve({
                promotionCycle:
                  promotionCycleResponse.data.promotionCycles.length > 0
                    ? promotionCycleResponse.data.promotionCycles[0]
                    : null,
                recommendations: recommendationResponse.data.recommendations,
                statement: payload.statement,
                comment: payload.comment,
              });
            })
            .catch((error: AxiosError) => {
              dispatch(
                enqueueSnackbarMessage({
                  message:
                    error.response?.status === 500
                      ? String(error.response?.data)
                      : "Unable to load recommendation",
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
                  : "Unable to save recommendation",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const submitRecommendation = createAsyncThunk(
  "lead/submitRecommendation",
  async (
    payload: {
      id: number;
      statement: string;
      comment: string | null;
      leadEmail: string;
    },
    { dispatch }
  ) => {
    return new Promise<{
      recommendations: RecommendationInterface[];
      promotionCycle: ActivePromotionCycleInterface | null;
    }>((resolve, reject) => {
      APIService.getInstance()
        .patch<{ status: string }>(
          AppConfig.serviceUrls.savePromotionRecommendation,
          payload
        )
        .then((resp) => {
          APIService.getInstance()
            .get<{ status: string }>(
              AppConfig.serviceUrls.savePromotionRecommendation +
                "/" +
                payload.id +
                "/submit"
            )
            .then((resp) => {
              Promise.all([
                APIService.getInstance().get<{
                  recommendations: RecommendationInterface[];
                }>(
                  AppConfig.serviceUrls.getPromotionRecommendations +
                    "?leadEmail=" +
                    payload.leadEmail +
                    "&statusArray=REQUESTED"
                ),
                APIService.getInstance().get<{
                  promotionCycles: ActivePromotionCycleInterface[];
                }>(AppConfig.serviceUrls.getActivePromotionCycle),
              ])
                .then(([recommendationResponse, promotionCycleResponse]) => {
                  dispatch(
                    enqueueSnackbarMessage({
                      message: SnackMessage.success.submitRecommendation,
                      type: "success",
                    })
                  );
                  resolve({
                    promotionCycle:
                      promotionCycleResponse.data.promotionCycles.length > 0
                        ? promotionCycleResponse.data.promotionCycles[0]
                        : null,
                    recommendations:
                      recommendationResponse.data.recommendations,
                  });
                })
                .catch((error: AxiosError) => {
                  dispatch(
                    enqueueSnackbarMessage({
                      message:
                        error.response?.status === 500
                          ? String(error.response?.data)
                          : "Unable to refresh recommendation list",
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
                      : "Unable to submit recommendation",
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
                  : "Unable to save the recommendation",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const declineRecommendation = createAsyncThunk(
  "lead/declineRecommendation",
  async (
    payload: { id: number; comment: string; leadEmail: string },
    { dispatch }
  ) => {
    return new Promise<{
      recommendations: RecommendationInterface[];
      promotionCycle: ActivePromotionCycleInterface | null;
    }>((resolve, reject) => {
      APIService.getInstance()
        .get<{ status: string }>(
          AppConfig.serviceUrls.savePromotionRecommendation +
            "/" +
            payload.id +
            "/decline?comment=" +
            encodeURIComponent(payload.comment)
        )
        .then((resp) => {
          Promise.all([
            APIService.getInstance().get<{
              recommendations: RecommendationInterface[];
            }>(
              AppConfig.serviceUrls.getPromotionRecommendations +
                "?leadEmail=" +
                payload.leadEmail +
                "&statusArray=REQUESTED"
            ),
            APIService.getInstance().get<{
              promotionCycles: ActivePromotionCycleInterface[];
            }>(AppConfig.serviceUrls.getActivePromotionCycle),
          ])
            .then(([recommendationResponse, promotionCycleResponse]) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: SnackMessage.success.declineRecommendation,
                  type: "success",
                })
              );
              resolve({
                promotionCycle:
                  promotionCycleResponse.data.promotionCycles.length > 0
                    ? promotionCycleResponse.data.promotionCycles[0]
                    : null,
                recommendations: recommendationResponse.data.recommendations,
              });
            })
            .catch((error: AxiosError) => {
              dispatch(
                enqueueSnackbarMessage({
                  message:
                    error.response?.status === 500
                      ? String(error.response?.data)
                      : "Unable to load recommendations",
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
                  : "Unable to decline recommendation",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const LeadSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    setCurrentEdit: (state, action: PayloadAction<EditObjInterface | null>) => {
      if (action.payload) {
        var recommendation = action.payload.recommendationStatement;
        var backupRecommendation = action.payload.statementBackup;

        var additionalComment = action.payload.recommendationAdditionalComment;
        var additionalCommentBackup = action.payload.additionalCommentBackup;

        const currentStatement = recommendation ? recommendation : "";

        const backupStatement = backupRecommendation
          ? backupRecommendation
          : "";

        action.payload.isModified =
          backupStatement !== currentStatement ||
          additionalComment !== additionalCommentBackup;

        action.payload.isEmpty =
          currentStatement.replace(/<\/?[^>]+(>|$)/g, "") === "";
      }
      state.currentEditObject = action.payload;
    },
    resetCurrentUser: (state) => {
      state.currentUserData = null;
    },
  },
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      .addCase(loadRequesterData.pending, (state, action) => {
        state.stateMessage = "Loading Requester Data";
        state.state = "loading";
      })
      .addCase(loadRequesterData.fulfilled, (state, action) => {
        state.currentUserData = action.payload.employeeInfo;
        state.state = "success";
      })
      .addCase(loadRequesterData.rejected, (state, action) => {
        state.state = "failed";
      })
      .addCase(
        getAllRecommendationsWithActivePromoCycle.pending,
        (state, action) => {
          state.stateMessage = "Loading Requests";
          state.state = "loading";
        }
      )
      .addCase(
        getAllRecommendationsWithActivePromoCycle.fulfilled,
        (state, action) => {
          state.recommendations = action.payload.recommendations;
          state.activePromotionCycle = action.payload.promotionCycle;
          state.state = "success";
        }
      )
      .addCase(
        getAllRecommendationsWithActivePromoCycle.rejected,
        (state, action) => {
          state.state = "failed";
        }
      )
      .addCase(saveRecommendation.pending, (state, action) => {
        state.backgroundProcessMessage = "Saving Recommendation";
        state.backgroundProcess = true;
      })
      .addCase(saveRecommendation.fulfilled, (state, action) => {
        state.recommendations = action.payload.recommendations;

        if (state.currentEditObject) {
          state.currentEditObject.additionalCommentBackup =
            action.payload.comment;
          state.currentEditObject.statementBackup = action.payload.statement;
          state.currentEditObject.recommendationStatement =
            action.payload.statement;
          state.currentEditObject.recommendationAdditionalComment =
            action.payload.comment;

          state.currentEditObject.isModified = false;
          state.currentEditObject.isEmpty = false;
        }

        state.backgroundProcess = false;
      })
      .addCase(saveRecommendation.rejected, (state, action) => {
        state.backgroundProcess = false;
      })
      .addCase(submitRecommendation.pending, (state, action) => {
        state.backgroundProcessMessage = "Submitting Recommendation";
        state.backgroundProcess = true;
      })
      .addCase(submitRecommendation.fulfilled, (state, action) => {
        state.recommendations = action.payload.recommendations;
        state.currentEditObject = null;
        state.backgroundProcess = false;
      })
      .addCase(submitRecommendation.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      .addCase(declineRecommendation.pending, (state, action) => {
        state.backgroundProcessMessage = "Declining Recommendation";
        state.backgroundProcess = true;
      })
      .addCase(declineRecommendation.fulfilled, (state, action) => {
        state.recommendations = action.payload.recommendations;
        state.backgroundProcess = false;
      })
      .addCase(declineRecommendation.rejected, (state, action) => {
        state.backgroundProcess = false;
      });
  },
});

export const { setCurrentEdit, resetCurrentUser } = LeadSlice.actions;

export default LeadSlice.reducer;
