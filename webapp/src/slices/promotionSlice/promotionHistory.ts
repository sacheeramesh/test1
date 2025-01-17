import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { AxiosError } from "axios";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";

export type stateType = "failed" | "success" | "loading" | "idle";

export enum ApplicationState {
  REQUESTED = "REQUESTED",
  ACTIVE = "ACTIVE",
  SUBMITTED = "SUBMITTED",
  DRAFT = "DRAFT",
  DECLINED = "DECLINED",
  WITHDRAW = "WITHDRAW",
  REMOVED = "REMOVED",
}

export enum PromotionType {
  SPECIAL = "SPECIAL",
  NORMAL = "NORMAL",
  TIME_BASED = "TIME_BASED",
}

export interface PromotionRequest {
  currentJobBand: string;
  employeeEmail: string;
  id: number;
  nextJobBand: number;
  businessUnit: string;
  department: string;
  team: string;
  promotionCycle: string;
  promotionStatement: string;
  backupPromotionStatement: string;
  recommendations: RecommendationInterface[];
  promotionType: PromotionType;
  status: ApplicationState;
}

export interface RecommendationInterface {
  leadEmail: string;
  recommendationID: number;
  recommendationStatus: ApplicationState;
  reportingLead: boolean;
  isSample: boolean;
  recommendationAdditionalComment: string | null;
  recommendationStatement: string | null;
}

export interface ApplicationsState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  requests: PromotionRequest[] | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

const initialState: ApplicationsState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  requests: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getAllPromotion = createAsyncThunk(
  "promotion/promotion-history",
  async (email: string, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "?statusArray=APPROVED&employeeEmail=" +
              email
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

export const PromotionHistorySlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPromotion.pending, (state, action) => {
        state.stateMessage = "Loading Promotions";
        state.state = "loading";
      })
      .addCase(getAllPromotion.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getAllPromotion.rejected, (state, action) => {
        state.state = "failed";
      });
  },
});

export default PromotionHistorySlice.reducer;
