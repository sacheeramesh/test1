// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig, PromotionType } from "@config/config";
import {
  ActivePromotionCycleInterface,
  PromotionRequest,
  SpecialPromotionState,
} from "@utils/types";
import { SnackMessage } from "@config/constant";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";

const initialState: SpecialPromotionState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,
  activePromotionCycle: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getInitialData = createAsyncThunk(
  "specialPromotion/getInitialData",
  async (_, { dispatch }) => {
    return new Promise<{
      activePromotionCycle: ActivePromotionCycleInterface | null;
    }>((resolve, reject) => {
      APIService.getInstance()
        .get<{ promotionCycles: ActivePromotionCycleInterface[] }>(
          AppConfig.serviceUrls.getActivePromotionCycle
        )
        .then(
          (promotionCycleResponse) => {
            var data: ActivePromotionCycleInterface | null = null;

            if (promotionCycleResponse.data.promotionCycles.length > 0) {
              data = promotionCycleResponse.data.promotionCycles[0];
            }
            resolve({ activePromotionCycle: data });
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
);

export const requestSpecialPromotion = createAsyncThunk(
  "specialPromotion/requestSpecialPromotion",
  async (
    payload: {
      promotionId: number;
      employeeEmail: string;
      jobBand: number;
      promotionStatement: string;
      reset: () => void;
    },
    { dispatch }
  ) => {
    return new Promise<{ applicationID: number }>((resolve, reject) => {
      APIService.getInstance()
        .post<{ applicationID: number }>(AppConfig.serviceUrls.applyPromotion, {
          PromotionCycleID: payload.promotionId,
          type: PromotionType.INDIVIDUAL_CONTRIBUTOR,
          promotingJobBand: payload.jobBand,
          employeeEmail: payload.employeeEmail,
          statement: payload.promotionStatement,
        })
        .then((res) => {
          payload.reset();
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.requestForSpecialPromotion,
              type: "success",
            })
          );
          resolve({ applicationID: res.data.applicationID });
        })
        .catch((error: any) => {
          dispatch(
            enqueueSnackbarMessage({
              message: error.response?.data.message,
              type: "error",
            })
          );

          reject(error);
        });
    });
  }
);

export const SpecialPromotionSlice = createSlice({
  name: "specialPromotion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInitialData.pending, (state, action) => {
        state.state = "loading";
        state.stateMessage = "Checking Active Promotion Cycle Details";
      })
      .addCase(getInitialData.fulfilled, (state, action) => {
        state.activePromotionCycle = action.payload.activePromotionCycle;

        state.state = "success";
        state.stateMessage = null;
      })
      .addCase(getInitialData.rejected, (state, payload) => {
        state.state = "failed";
        state.stateMessage = null;
      })

      //Submitting application
      .addCase(requestSpecialPromotion.pending, (state, action) => {
        state.backgroundProcessMessage =
          "Individual Contributor Promotion Submission in Progress";
        state.backgroundProcess = true;
      })
      .addCase(requestSpecialPromotion.fulfilled, (state, action) => {
        state.backgroundProcess = false;
      })
      .addCase(requestSpecialPromotion.rejected, (state, action) => {
        state.backgroundProcess = false;
      });
  },
});

export default SpecialPromotionSlice.reducer;
