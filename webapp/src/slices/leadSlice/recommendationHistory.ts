import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig, PromotionType } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";
import {
  ActivePromotionCycleInterface,
  RecommendationInterface,
} from "@utils/types";

export interface RecommendationHistoryState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  recommendations: RecommendationInterface[];
  activeCycleId: string | null;
  errorMessage: string | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

const initialState: RecommendationHistoryState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  recommendations: [],
  activeCycleId: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getRecommendationsHistory = createAsyncThunk(
  "recommendationHistory/getRecommendationsHistory",
  async (leadEmail: string, { dispatch }) => {
    return new Promise<{ recommendations: RecommendationInterface[] }>(
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
              dispatch(setCycleId(promotionCycle.id?.toString()));
            }

            APIService.getInstance()
              .get<{
                recommendations: RecommendationInterface[];
              }>(
                AppConfig.serviceUrls.getPromotionRecommendations +
                  "?leadEmail=" +
                  leadEmail +
                  "&statusArray=SUBMITTED,DECLINED,EXPIRED"
              )
              .then((recommendationsResponse) => {
                resolve({
                  recommendations: recommendationsResponse.data.recommendations,
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

export const RecommendationHistorySlice = createSlice({
  name: "recommendationHistory",
  initialState,
  reducers: {
    setCycleId: (state, action: PayloadAction<string | null>) => {
      state.activeCycleId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendationsHistory.pending, (state) => {
        state.stateMessage = "Loading Requests";
        state.state = "loading";
      })
      .addCase(getRecommendationsHistory.fulfilled, (state, action) => {
        state.recommendations = action.payload.recommendations.filter(
          (recommendation) =>
            recommendation.promotionType == PromotionType.TIME_BASED
        );
        state.state = "success";
      })
      .addCase(getRecommendationsHistory.rejected, (state, action) => {
        state.state = "failed";
      });
  },
});

export const { setCycleId } = RecommendationHistorySlice.actions;

export default RecommendationHistorySlice.reducer;
