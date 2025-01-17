// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Theme } from "@mui/material";
import {
  ActivePromotionCycleInterface,
  ApplicationState,
  PromotionRequest,
  PromotionType,
  RecommendationState,
  Role,
} from "./types";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { setStateMessage } from "@slices/functionalLeadSlices/activeRequest";
import { APIService } from "./apiService";
import { AppConfig } from "@config/config";
import { throttledFetchUserData } from "./throttle";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";

export const isIncludedRole = (a: Role[], b: Role[]): boolean => {
  return [...getCrossItems(a, b), ...getCrossItems(b, a)].length > 0;
};

function getCrossItems<Role>(a: Role[], b: Role[]): Role[] {
  return a.filter((element) => {
    return b.includes(element);
  });
}

export const capitalizedFLWords = (str: string) => {
  str = str.toLowerCase();
  const arr = str.split(" ");

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  return arr.join(" ");
};

export const setNAforNull = (str: string) => {
  if (str === null || str === undefined || str === "") {
    return "N/A";
  }

  return str;
};

export const getPromotionRequestStatus = (status: string) => {
  if (
    status === "APPROVED" ||
    status === "REJECTED" ||
    status === "FL_APPROVED" ||
    status === "FL_REJECTED"
  ) {
    return "PROCESSING";
  }

  return status.replace("_", " ").replace("FL", "FUNCTIONAL LEAD");
};

export const getPromotionRequestStatusWithActiveCycle = (
  status: ApplicationState,
  isCurrentCycle: boolean
) => {
  if (
    isCurrentCycle &&
    (status === "APPROVED" ||
      status === "REJECTED" ||
      status === "FL_APPROVED" ||
      status === "FL_REJECTED" ||
      status === "SUBMITTED")
  ) {
    return ApplicationState.PROCESSING;
  }

  return status;
};

export const getApplicationColor = (status: ApplicationState) => {
  if (status === ApplicationState.DECLINED) {
    return "#FF5630";
  } else if (status === ApplicationState.PROCESSING) {
    return "#FFAB00";
  } else if (status === ApplicationState.DRAFT) {
    return "#FFAB00";
  } else if (status === ApplicationState.REQUESTED) {
    return "#76BA1B";
  } else if (status === ApplicationState.SUBMITTED) {
    return "#A980FF";
  } else if (status === ApplicationState.WITHDRAW) {
    return "#172B4D";
  } else if (status === ApplicationState.FL_APPROVED) {
    return "#FF5630";
  } else if (status === ApplicationState.FL_REJECTED) {
    return "#FF0000";
  } else if (status === ApplicationState.APPROVED) {
    return "#76BA1B";
  } else if (status === ApplicationState.REJECTED) {
    return "#FF0000";
  } else if (status === ApplicationState.REMOVED) {
    return "#DE350B";
  } else if (status === ApplicationState.EXPIRED) {
    return "#727681";
  } else {
    return "#0052CC";
  }
};

export const getRecommendationColor = (status: RecommendationState) => {
  if (status === RecommendationState.DECLINED) {
    return "#FF5630";
  } else if (status === RecommendationState.REQUESTED) {
    return "#36B37E";
  } else if (status === RecommendationState.SUBMITTED) {
    return "#6554C0";
  } else if (status === RecommendationState.EXPIRED) {
    return "#DE350B";
  } else {
    return "#0052CC";
  }
};

export const getIndexBasedRowColor = (index: number, theme: Theme) => {
  if (index % 2 === 0) {
    return theme.palette.mode === "light" ? "#F4F5F7" : "#1F2937";
  } else {
    return undefined;
  }
};

export const transformFLState = (state: string, data: PromotionRequest) => {
  if (data.promotionType === PromotionType.TIME_BASED) {
    return "N/A";
  } else if (state === ApplicationState.FL_APPROVED.toString()) {
    return "Pending";
  } else if (state === ApplicationState.APPROVED) {
    return "Approved";
  } else {
    return "Rejected";
  }
};

export const getApplicationCountBasedOnState = (
  requests: PromotionRequest[] | null,
  statuses: ApplicationState[]
) => {
  if (requests === null) return 0;

  let count = 0;
  requests.forEach((request) => {
    if (statuses.includes(request.status)) {
      count++;
    }
  });
  return count;
};

export const formatTimeStampToUTC = (date: string) => {
  return new Date(date).toUTCString();
};

//Utils for network call

export const fetchPromotionRequests = (data: {
  url: string;
  resolve: (value: { promotionRequests: PromotionRequest[] }) => void;
  reject: { (reason?: any): void; (arg0: Error): void };
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>;
  successMessage?: string;
  setStateMessage?: (message: string) => void;
}) => {
  setStateMessage && setStateMessage("Checking promotion cycle details");
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

      if (promotionCycle?.id === undefined) {
        data.resolve({ promotionRequests: [] });
      } else {
        APIService.getInstance()
          .get<{ promotionRequests: PromotionRequest[] }>(
            data.url + "&cycleId=" + promotionCycle?.id
          )
          .then((resp) => {
            var HistoryRequests: string[] = [];
            resp.data.promotionRequests.map((request: PromotionRequest) => {
              HistoryRequests.push(
                AppConfig.serviceUrls.getEmployeeHistory +
                  "?employeeWorkEmail=" +
                  request.employeeEmail
              );
            });
            throttledFetchUserData(HistoryRequests, 50, 500, (message) => {
              setStateMessage && setStateMessage(message);
            }).then((histories: any[]) => {
              resp.data.promotionRequests.forEach((value, index) => {
                var history = histories[index];
                if (history && history.data && history.data.employeeInfo) {
                  value.lastPromotedDate =
                    history.data.employeeInfo.lastPromotedDate;
                  value.joinDate = history.data.employeeInfo.startDate;
                  value.location = history.data.employeeInfo.joinedLocation;
                } else {
                  value.lastPromotedDate = "<error>";
                  value.joinDate = "<error>";
                  value.location = "<error>";
                }
              });
              data.successMessage &&
                data.dispatch(
                  enqueueSnackbarMessage({
                    message: data.successMessage,
                    type: "success",
                  })
                );
              data.resolve(resp.data);
            });
          })
          .catch((error: AxiosError) => {
            data.dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data)
                    : "Unable to load requests",
                type: "error",
              })
            );
            data.reject(error);
          });
      }
    })
    .catch((error: Error) => {
      data.reject(error);
    });
};
