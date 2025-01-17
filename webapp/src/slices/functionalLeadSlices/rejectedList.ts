import { createSlice, createAsyncThunk, ThunkDispatch, AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";

import { ActivePromotionCycleInterface, EmployeeInfo, PromotionRequest } from "@utils/types";
import { AxiosError } from "axios";
import { SnackMessage } from "@config/constant";
import { fetchPromotionRequests } from "@utils/utils";

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

export const getRejectedPromotionRequests = createAsyncThunk(
  "fl_rejected_list/getRejectedPromotionRequests",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        fetchPromotionRequests({
          url: AppConfig.serviceUrls.retrieveFLRejectedPromotionApplications,
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

export const FunctionalLeadRejectedList = createSlice({
  name: "fl_rejected_list",
  initialState,
  reducers: {
    reset: (state) => {
      state.state = "idle";
      state.stateMessage = "";
      state.requests =  null;
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
      .addCase(getRejectedPromotionRequests.pending, (state, action) => {
        state.stateMessage = "Loading Promotion Requests";
        state.state = "loading";
      })
      .addCase(getRejectedPromotionRequests.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getRejectedPromotionRequests.rejected, (state, action) => {
        state.state = "failed";
      })
  },
});

export const { reset,setStateMessage } = FunctionalLeadRejectedList.actions;

export default FunctionalLeadRejectedList.reducer;
