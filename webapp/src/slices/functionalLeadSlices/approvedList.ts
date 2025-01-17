import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AppConfig } from "@config/config";
import {
  PromotionRequest,
} from "@utils/types";
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

export const getFLApprovedPromotionRequests = createAsyncThunk(
  "fl_approved_list/getFLApprovedPromotionRequests",
  async (_, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        fetchPromotionRequests({
          url: AppConfig.serviceUrls.retrieveFLApprovedPromotionApplications,
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

export const FunctionalApprovedList = createSlice({
  name: "fl_approved_list",
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
      });
  },
});

export const { reset,setStateMessage } = FunctionalApprovedList.actions;

export default FunctionalApprovedList.reducer;
