import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";

import { PromotionRequest } from "@utils/types";

import { fetchPromotionRequests } from "@utils/utils";

import { AxiosError } from "axios";
import { SnackMessage } from "@config/constant";

export interface PromotionState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  requests: PromotionRequest[] | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

const initialState: PromotionState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  requests: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getActivePromotionRequests = createAsyncThunk(
  "functional-lead-active-request/getActivePromotionRequests",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        fetchPromotionRequests({
          url: AppConfig.serviceUrls.retrieveFLPromotionApplications,
          resolve: resolve,
          reject: reject,
          dispatch: dispatch,
          setStateMessage: (message: string) => {
            dispatch(setStateMessage(message));
          },
        });
      }
    );
  }
);

export const approveFLPromotionRequest = createAsyncThunk(
  "functional-lead-active-request/approveFLPromotionRequest",
  async (id: number, { dispatch, getState }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "/" +
              id +
              "/approve?from=functional_lead"
          )
          .then(() => {
            const state = getState() as any;
            const currentState = state.fl_requests as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.approveFunctionalLeadRequest,
                type: "success",
              })
            );
            resolve({
              promotionRequests: currentState.requests
                ? currentState.requests.filter((req) => req.id !== id)
                : [],
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
      }
    );
  }
);

export const rejectFLPromotionRequest = createAsyncThunk(
  "functional-lead-active-request/rejectFLPromotionRequest",
  async (payload: { id: number; reason: string }, { dispatch,getState }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "/" +
              payload.id +
              "/reject?from=functional_lead&reason=" +
              encodeURIComponent(payload.reason)
          )
          .then(() => {
            const state = getState() as any;
            const currentState = state.fl_requests as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.rejectFunctionalLeadRequest,
                type: "success",
              })
            );
            resolve({
              promotionRequests: currentState.requests
                ? currentState.requests.filter((req) => req.id !== payload.id)
                : [],
            });
          })
          .catch((error: AxiosError) => {
            dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data)
                    : "Unable to reject promotion requests",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const approveFLPromotionRequestList = createAsyncThunk(
  "functional-lead-active-request/approveFLPromotionRequestList",
  async (ids: number[], { dispatch,getState }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        var approvalRequests: any[] = [];
        ids.map((id: number) => {
          approvalRequests.push(
            APIService.getInstance().get(
              AppConfig.serviceUrls.retrieveAllPromotionRequests +
                "/" +
                id +
                "/approve?from=functional_lead"
            )
          );
        });
        Promise.all(approvalRequests)
          .then(() => {
            const state = getState() as any;
            const currentState = state.fl_requests as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.approveFunctionalLeadRequests,
                type: "success",
              })
            );
            resolve({
              promotionRequests: currentState.requests
                ? currentState.requests.filter((req) => !ids.includes(req.id))
                : [],
            });
          })
          .catch((error: AxiosError) => {
            dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data)
                    : "Unable to approve promotion requests",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const rejectFLPromotionRequestList = createAsyncThunk(
  "functional-lead-active-request/rejectFLPromotionRequestList",
  async (payload: { ids: number[]; reason: string }, { dispatch,getState }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        var approvalRequests: any[] = [];
        payload.ids.map((id: number) => {
          approvalRequests.push(
            APIService.getInstance().get(
              AppConfig.serviceUrls.retrieveAllPromotionRequests +
                "/" +
                id +
                "/reject?from=functional_lead&reason=" +
                encodeURIComponent(payload.reason)
            )
          );
        });

        Promise.all(approvalRequests)
          .then(() => {
            const state = getState() as any;
            const currentState = state.fl_requests as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.rejectFunctionalLeadRequests,
                type: "success",
              })
            );
            resolve({
              promotionRequests: currentState.requests
                ? currentState.requests.filter((req) => !payload.ids.includes(req.id))
                : [],
            });
          })
          .catch((error: AxiosError) => {
            dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data)
                    : "Unable to reject promotion requests",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const FunctionalLead = createSlice({
  name: "functional-lead-active-request",
  initialState,
  reducers: {
    reset: (state) => {
      state.state = "idle";
      state.stateMessage = "";
      state.requests = null;
      state.backgroundProcess = false;
      state.backgroundProcessMessage = "";
    },

    setStateMessage: (state, action: PayloadAction<string>) => {
      state.stateMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      .addCase(getActivePromotionRequests.pending, (state, action) => {
        state.state = "loading";
        state.stateMessage = "Loading Promotion Requests";
      })
      .addCase(getActivePromotionRequests.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getActivePromotionRequests.rejected, (state, action) => {
        state.state = "failed";
      })

      // approving withdrawal request
      .addCase(approveFLPromotionRequest.pending, (state, action) => {
        state.backgroundProcessMessage = "Approving Promotion Requests";
        state.backgroundProcess = true;
      })
      .addCase(approveFLPromotionRequest.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(approveFLPromotionRequest.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(rejectFLPromotionRequest.pending, (state, action) => {
        state.backgroundProcessMessage = "Rejecting Promotion Requests";
        state.backgroundProcess = true;
      })
      .addCase(rejectFLPromotionRequest.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(rejectFLPromotionRequest.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(approveFLPromotionRequestList.pending, (state, action) => {
        state.backgroundProcessMessage = "Approving Promotion Requests";
        state.backgroundProcess = true;
      })
      .addCase(approveFLPromotionRequestList.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(approveFLPromotionRequestList.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(rejectFLPromotionRequestList.pending, (state, action) => {
        state.backgroundProcessMessage = "Rejecting Promotion Requests";
        state.backgroundProcess = true;
      })
      .addCase(rejectFLPromotionRequestList.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(rejectFLPromotionRequestList.rejected, (state, action) => {
        state.backgroundProcess = false;
      });
  },
});

export const { reset, setStateMessage } = FunctionalLead.actions;

export default FunctionalLead.reducer;
