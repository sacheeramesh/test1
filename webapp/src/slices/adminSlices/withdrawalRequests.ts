import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";
import { SnackMessage } from "@config/constant";

export type stateType = "failed" | "success" | "loading" | "idle";

export enum ApplicationState {
  REQUESTED = "REQUESTED",
  ACTIVE = "ACTIVE",
  SUBMITTED = "SUBMITTED",
  DRAFT = "DRAFT",
  DECLINED = "DECLINED",
  WITHDRAW = "WITHDRAW",
  REMOVED = "REMOVED",
  PROCESSING = "PROCESSING",
}

export interface PromotionRequest {
  currentJobBand: string;
  employeeEmail: string;
  id: number;
  nextJobBand: number;
  promotionCycle: string;
  promotionStatement: string;
  backupPromotionStatement: string;
  recommendations: RecommendationInterface[];
  status: ApplicationState;
}

export interface RecommendationInterface {
  leadEmail: string;
  recommendationID: number;
  recommendationStatus: ApplicationState;
  reportingLead: boolean;
  recommendationStatement: string;
  isSample: boolean;
}

export interface PromotionState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  withdrawalRequests: PromotionRequest[] | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

const initialState: PromotionState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  withdrawalRequests: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getAllWithdrawalRequest = createAsyncThunk(
  "user_admin/getWithdrawalRequest",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "?statusArray=WITHDRAW,REMOVED"
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
                    : "Unable to get withdrawal requests",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

// Background Process
export const approveWithdrawalRequest = createAsyncThunk(
  "user_admin/approveWithdrawalRequest",
  async (id: number, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "/" +
              id +
              "/remove"
          )
          .then(() => {
            APIService.getInstance()
              .get(
                AppConfig.serviceUrls.retrieveAllPromotionRequests +
                  "?statusArray=WITHDRAW&isCurrentPromotionCycle=true"
              )
              .then((resp) => {
                dispatch(
                  enqueueSnackbarMessage({
                    message: SnackMessage.success.approveWithdrawalRequest,
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
                        : "Unable to refresh",
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
                    : "Unable to approve withdrawal request",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const rejectWithdrawalRequest = createAsyncThunk(
  "admin/rejectWithdrawalRequest",
  async (id: number, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "/" +
              id +
              "/submit"
          )
          .then(() => {
            APIService.getInstance()
              .get(
                AppConfig.serviceUrls.retrieveAllPromotionRequests +
                  "?statusArray=WITHDRAW&isCurrentPromotionCycle=true"
              )
              .then((resp) => {
                dispatch(
                  enqueueSnackbarMessage({
                    message: SnackMessage.success.rejectWithdrawalRequest,
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
                        : "Unable to approve reject request",
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
                    : "Unable to reject withdrawal request",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const AdminSlice = createSlice({
  name: "user_admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      .addCase(getAllWithdrawalRequest.pending, (state, action) => {
        state.stateMessage = "Loading Withdrawal Requests";
        state.state = "loading";
      })
      .addCase(getAllWithdrawalRequest.fulfilled, (state, action) => {
        state.withdrawalRequests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getAllWithdrawalRequest.rejected, (state, action) => {
        state.state = "failed";
      })

      // approving withdrawal request
      .addCase(approveWithdrawalRequest.pending, (state, action) => {
        state.backgroundProcessMessage = "Approving Withdrawal Requests";
        state.backgroundProcess = true;
      })
      .addCase(approveWithdrawalRequest.fulfilled, (state, action) => {
        state.withdrawalRequests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(approveWithdrawalRequest.rejected, (state, action) => {
        state.backgroundProcess = false;
      })

      // approving withdrawal request
      .addCase(rejectWithdrawalRequest.pending, (state, action) => {
        state.backgroundProcessMessage = "Rejecting Withdrawal Requests";
        state.backgroundProcess = true;
      })
      .addCase(rejectWithdrawalRequest.fulfilled, (state, action) => {
        state.withdrawalRequests = action.payload.promotionRequests;
        state.backgroundProcess = false;
      })
      .addCase(rejectWithdrawalRequest.rejected, (state, action) => {
        state.backgroundProcess = false;
      });
  },
});

// export const {} = AdminSlice.actions;

export default AdminSlice.reducer;
