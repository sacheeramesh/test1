import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";

import { NotificationHubState } from "@utils/types";
import { AxiosError } from "axios";

const initialState: NotificationHubState = {
  state: "idle",
  stateMessage: null,
  errorMessage: null,

  processingList: [],
  doneList: [],
  failedList: [],

  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const notifyApplicant = createAsyncThunk(
  "admin-notification-hub/notifyApplicant",
  async (payload: { id: number; effectiveDate?: string , showFeedback?:boolean}, { dispatch }) => {
    return new Promise<{ status: string }>((resolve, reject) => {
      APIService.getInstance()
        .get<{ status: string }>(
          AppConfig.serviceUrls.retrieveAllPromotionRequests +
            "/" +
            payload.id +
            "/send-email-notification" +
            (payload.effectiveDate
              ? "?effectiveDate=" + payload.effectiveDate
              : "")
        )
        .then((resp) => {
          payload.showFeedback && dispatch(
            enqueueSnackbarMessage({
              message: "Notification sent successfully",
              type: "success",
            })
          );
          resolve(resp.data);
        })
        .catch((error: AxiosError) => {
          payload.showFeedback && dispatch(
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
    });
  }
);

export const NotificationHub = createSlice({
  name: "admin-notification-hub",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      .addCase(notifyApplicant.pending, (state, action) => {
        state.backgroundProcess = true;

        action.meta.arg.id && state.processingList.push(action.meta.arg.id);

        state.backgroundProcessMessage = "Sending Notification...";
      })
      .addCase(notifyApplicant.fulfilled, (state, action) => {
        action.meta.arg.id &&
          state.processingList.splice(
            state.processingList.indexOf(action.meta.arg.id),
            1
          );
        action.meta.arg.id && state.doneList.push(action.meta.arg.id);
        state.backgroundProcess = false;
      })
      .addCase(notifyApplicant.rejected, (state, action) => {
        action.meta.arg.id &&
          state.processingList.splice(
            state.processingList.indexOf(action.meta.arg.id),
            1
          );
        action.meta.arg.id && state.failedList.push(action.meta.arg.id);
        state.backgroundProcess = false;
      });
  },
});

export default NotificationHub.reducer;
