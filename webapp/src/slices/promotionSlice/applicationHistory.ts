import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import {
  ActivePromotionCycleInterface,
  ApplicationsState,
  PromotionRequest,
} from "@utils/types";
import { AxiosError } from "axios";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";

const initialState: ApplicationsState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  activeCycleId: null,
  requests: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getAllPromotionRequest = createAsyncThunk(
  "promotion/getWithdrawalRequest",
  async (email: string, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        Promise.all([
          APIService.getInstance().get<{
            promotionCycles: ActivePromotionCycleInterface[];
          }>(AppConfig.serviceUrls.getActivePromotionCycle),
          APIService.getInstance().get<{
            promotionCycles: ActivePromotionCycleInterface[];
          }>(AppConfig.serviceUrls.getClosePromotionCycle),
        ])
          .then(([open, close]) => {
            var promotionCycle = {
              ...close.data?.promotionCycles[0],
              ...open.data?.promotionCycles[0],
            };

            if (promotionCycle !== undefined) {
              dispatch(setCycleId(promotionCycle.name));
            }

            APIService.getInstance()
              .get(
                AppConfig.serviceUrls.retrieveAllPromotionRequests +
                  "?employeeEmail=" +
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
                        : "Unable to load requests",
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
                    : "Unable to load promotion cycle",
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
  name: "admin",
  initialState,
  reducers: {
    setCycleId: (state, action: PayloadAction<string | null>) => {
      state.activeCycleId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPromotionRequest.pending, (state, action) => {
        state.stateMessage = "Loading Promotion Requests";
        state.state = "loading";
      })
      .addCase(getAllPromotionRequest.fulfilled, (state, action) => {
        state.requests = action.payload.promotionRequests;
        state.state = "success";
      })
      .addCase(getAllPromotionRequest.rejected, (state, action) => {
        state.state = "failed";
      });
  },
});

export const { setCycleId } = AdminSlice.actions;

export default AdminSlice.reducer;
