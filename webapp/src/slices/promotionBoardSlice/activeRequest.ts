import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import {
  PromotionRequest,
} from "@utils/types";
import { AxiosError } from "axios";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { SnackMessage } from "@config/constant";
import { fetchPromotionRequests } from "@utils/utils";
export type stateType = "failed" | "success" | "loading" | "idle";

export interface PromotionState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  requests: PromotionRequest[] | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
  backgroundProcessTotal: number,
  backgroundProcessCompleted: number,
}

const initialState: PromotionState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  requests: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
  backgroundProcessTotal: 0,
  backgroundProcessCompleted: 0,
};



//functional lead approved applications
export const getFLApprovedPromotionRequests = createAsyncThunk(
  "promotion-board/getFLApprovedPromotionRequests",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        fetchPromotionRequests({
          url: AppConfig.serviceUrls.retrievePBPromotionApplications,
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

export const approvePromotionRequest = createAsyncThunk(
  "promotion-board/approveWithdrawalRequest",
  async (id: number, { dispatch , getState}) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "/" +
              id +
              "/approve?from=promotion_board"
          )
          .then((resp) => {
            const state = getState() as any;
            const currentState = state.fL_approvedRequest as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.approvePromotionBoardRequest,
                type: "success",
              })
            );
            resolve({
              promotionRequests: currentState && currentState.requests
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

export const rejectPromotionRequest = createAsyncThunk(
  "promotion-board/rejectPromotionRequest",
  async (payload: { id: number; reason: string }, { dispatch, getState }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "/" +
              payload.id +
              "/reject?from=promotion_board&reason=" +
              encodeURIComponent(payload.reason)
          )
          .then((resp) => {
            const state = getState() as any;
            const currentState = state.fL_approvedRequest as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.rejectPromotionBoardRequest,
                type: "success",
              })
            );
            resolve({
              promotionRequests: currentState && currentState.requests
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
                    : "Unable to reject promotion request",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const approvePromotionRequestList = createAsyncThunk(
  "promotion-board/approvePromotionRequestList",
  async (ids: number[], { dispatch , getState}) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        var approvalRequests: any[] = [];
        ids.forEach((id: number) => {
          approvalRequests.push(
            APIService.getInstance().get(
              AppConfig.serviceUrls.retrieveAllPromotionRequests +
                "/" +
                id +
                "/approve?from=promotion_board"
            )
          );
        });

        Promise.all(approvalRequests)
          .then(() => {
            const state = getState() as any;
            const currentState = state.fL_approvedRequest as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.approvePromotionBoardRequests,
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

export const rejectPromotionRequestList = createAsyncThunk(
  "promotion/rejectPromotionRequestList",

  async (payload: { ids: number[]; reason: string }, { dispatch, getState }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        var approvalRequests: any[] = [];
        payload.ids.forEach((id: number) => {
          approvalRequests.push(
            APIService.getInstance().get(
              AppConfig.serviceUrls.retrieveAllPromotionRequests +
                "/" +
                id +
                "/reject?from=promotion_board&reason=" +
                encodeURIComponent(payload.reason)
            )
          );
        });

        Promise.all(approvalRequests)
          .then(() => {
            const state = getState() as any;
            const currentState = state.fL_approvedRequest as PromotionState;
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.success.rejectPromotionBoardRequests,
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

export const PromotionBoard = createSlice({
  name: "promotionBoard",
  initialState,
  reducers: {
    setStateMessage: (state, action: PayloadAction<string>) => {
      state.stateMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      .addCase(getFLApprovedPromotionRequests.pending, (state, action) => {
        state.stateMessage = "Loading Promotion Requests";
        state.state = "loading";
      })
      .addCase(getFLApprovedPromotionRequests.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getFLApprovedPromotionRequests.rejected, (state, action) => {
        state.state = "failed";
      })

      // approving withdrawal request
      .addCase(approvePromotionRequest.pending, (state, action) => {
        state.backgroundProcessMessage = "Approving Promotion Request";
        state.backgroundProcess = true;
      })
      .addCase(approvePromotionRequest.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(approvePromotionRequest.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(rejectPromotionRequest.pending, (state, action) => {
        state.backgroundProcessMessage = "Rejecting Promotion Request";
        state.backgroundProcess = true;
      })
      .addCase(rejectPromotionRequest.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(rejectPromotionRequest.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(approvePromotionRequestList.pending, (state, action) => {
        state.backgroundProcessMessage = "Approving Promotion Requests";
        state.backgroundProcess = true;
      })
      .addCase(approvePromotionRequestList.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(approvePromotionRequestList.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(rejectPromotionRequestList.pending, (state, action) => {
        state.backgroundProcessMessage = "Rejecting Promotion Requests";
        state.backgroundProcess = true;
      })
      .addCase(rejectPromotionRequestList.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(rejectPromotionRequestList.rejected, (state, action) => {
        state.backgroundProcess = false;
      });
  },
});
export const { setStateMessage } = PromotionBoard.actions;
export default PromotionBoard.reducer;
