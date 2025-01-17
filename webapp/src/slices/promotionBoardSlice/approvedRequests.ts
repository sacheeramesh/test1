import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppConfig } from "@config/config";
import { PromotionRequest } from "@utils/types";
import { fetchPromotionRequests } from "@utils/utils";
export type stateType = "failed" | "success" | "loading" | "idle";

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

//functional lead approved applications
export const getApprovedRequests = createAsyncThunk(
  "promotion/getApprovedRequests",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        fetchPromotionRequests({
          url: AppConfig.serviceUrls.retrievePBApprovedPromotionApplications,
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

export const ApprovedRequest = createSlice({
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
      .addCase(getApprovedRequests.pending, (state, action) => {
        state.stateMessage = "Loading Promotion Requests";
        state.state = "loading";
      })
      .addCase(getApprovedRequests.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getApprovedRequests.rejected, (state, action) => {
        state.state = "failed";
      });
  },
});

export const { setStateMessage } = ApprovedRequest.actions;
export default ApprovedRequest.reducer;
