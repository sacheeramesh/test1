// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { BaseURLAuthClientConfig } from "@asgardeo/auth-react";
import { ChoreoConfig } from "../utils/types";

declare global {
  interface Window {
    config: {
      ASGARDEO_BASE_URL: string;
      ASGARDEO_CLIENT_ID: string;
      ASGARDEO_REVOKE_ENDPOINT: string;
      AUTH_SIGN_IN_REDIRECT_URL: string;
      AUTH_SIGN_OUT_REDIRECT_URL: string;
      CHOREO_BACKEND_BASE_URL: string;
      REACT_APP_CHOREO_TOKEN_ENDPOINT: string;
      REACT_APP_CHOREO_REVOKE_ENDPOINT: string;
      REACT_APP_CHOREO_CLIENT_ID: string;
      REACT_APP_CHOREO_CLIENT_SECRET: string;
      JOB_BAND_FILE: string;
    };
  }
}

export const AsgardeoConfig: BaseURLAuthClientConfig = {
  signInRedirectURL: window.config?.AUTH_SIGN_IN_REDIRECT_URL ?? "",
  signOutRedirectURL: window.config?.AUTH_SIGN_OUT_REDIRECT_URL ?? "",
  clientID: window.config?.ASGARDEO_CLIENT_ID ?? "",
  baseUrl: window.config?.ASGARDEO_BASE_URL ?? "",
  scope: ["openid", "email", "groups"],
};

export const ChoreoAppConfig: ChoreoConfig = {
  tokenEndPoint: window.config?.REACT_APP_CHOREO_TOKEN_ENDPOINT ?? "",
  revokeEndPoint: window.config?.REACT_APP_CHOREO_REVOKE_ENDPOINT ?? "",
  clientId: window.config?.REACT_APP_CHOREO_CLIENT_ID ?? "",
  clientSecret: window.config?.REACT_APP_CHOREO_CLIENT_SECRET ?? "",
};

export const ServiceBaseUrl = window.config?.CHOREO_BACKEND_BASE_URL ?? "";

export const PROMOTION_CYCLE_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  END: "END",
};

export enum PromotionType {
  SPECIAL = "SPECIAL",
  NORMAL = "NORMAL",
  TIME_BASED = "TIME_BASED",
  INDIVIDUAL_CONTRIBUTOR = "INDIVIDUAL_CONTRIBUTOR",
}

export const AppConfig = {
  serviceUrls: {
    employeeInfoEndPoint: ServiceBaseUrl + "/employee-privileges",
    getActivePromotionCycle:
      ServiceBaseUrl +
      "/promotion/cycles?statusArray=" +
      PROMOTION_CYCLE_STATUS.OPEN,
    getClosePromotionCycle:
      ServiceBaseUrl +
      "/promotion/cycles?statusArray=" +
      PROMOTION_CYCLE_STATUS.CLOSED,
    createPromotionCycle: ServiceBaseUrl + "/promotion/cycles",
    timeBasedPromotion: ServiceBaseUrl + "/promotion/requests/time-based",
    basePathPromotionCycle: ServiceBaseUrl + "/promotion/cycles",
    checkPromotionRequests:
      ServiceBaseUrl +
      "/promotion/requests?statusArray=DRAFT,SUBMITTED,WITHDRAW,APPROVED,FL_APPROVED,FL_REJECTED,REJECTED&cycleId=",
    checkDraftedApplication:
      ServiceBaseUrl + "/promotion/requests?statusArray=DRAFT&cycleId=",
    checkAlreadyApplied:
      ServiceBaseUrl + "/promotion/requests?statusArray=SUBMITTED&cycleId=",
    userEligibilityCheck: ServiceBaseUrl + "/promotion/eligibility",
    applyPromotion: ServiceBaseUrl + "/promotion/requests",
    requestRecommendation: ServiceBaseUrl + "/promotion/recommendations",
    retrieveEmployeeList: ServiceBaseUrl + "/employees",
    savePromotionApplication: ServiceBaseUrl + "/promotion/requests",
    userPromotionRequest: ServiceBaseUrl + "/promotion/request",
    userBaseUrl: ServiceBaseUrl + "/users",
    submit: "/submit",
    decline: "/decline?comment=",
    getPromotionRecommendations: ServiceBaseUrl + "/promotion/recommendations",
    savePromotionRecommendation: ServiceBaseUrl + "/promotion/recommendations",
    getEmployeeHistory: ServiceBaseUrl + "/employee-info",

    //administration paths
    retrieveAllPromotionRequests: ServiceBaseUrl + "/promotion/requests",

    businessUnitSync: ServiceBaseUrl + "/business-units/sync",
    retrieveBusinessUnits: ServiceBaseUrl + "/business-units",

    //Get configurations
    getConfigs: ServiceBaseUrl + "/app-configs",

    //promotion board promotion application
    retrievePBPromotionApplications:
      ServiceBaseUrl + "/promotion/requests?statusArray=FL_APPROVED",
    retrievePBApprovedPromotionApplications:
      ServiceBaseUrl + "/promotion/requests?statusArray=APPROVED",
    retrievePBRejectedPromotionApplications:
      ServiceBaseUrl + "/promotion/requests?statusArray=REJECTED",
    retrievePBFLRejectedPromotionApplications:
      ServiceBaseUrl + "/promotion/requests?statusArray=FL_REJECTED",

    //functional lead promotion applications
    retrieveFLPromotionApplications:
      ServiceBaseUrl +
      "/promotion/requests?statusArray=SUBMITTED&enableBuFilter=true",
    retrieveFLApprovedPromotionApplications:
      ServiceBaseUrl +
      "/promotion/requests?statusArray=FL_APPROVED,APPROVED,REJECTED&enableBuFilter=true",
    retrieveFLRejectedPromotionApplications:
      ServiceBaseUrl +
      "/promotion/requests?statusArray=FL_REJECTED&enableBuFilter=true",
  },

  files: {
    jobBandFile: window.config?.JOB_BAND_FILE ?? "",
  },
};

export const APP_NAME: string = "Application Name";
