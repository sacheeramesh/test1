// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

// confirmation dialog messages
export const ApplicationSubmitDialog = {
  title: "Do you want to submit the application?",
  message: "Please note once submitted changes cannot be made",
  okText: "submit",
};

export const WithdrawApplicationDialog = {
  title: "",
  message: "Do you want to withdraw the application?",
  okText: "Withdraw",
};

export const SaveApplicationDialog = {
  title: "Do you want to save the application?",
  message: "Please note this will overwrite the existing content",
  okText: "save",
};

export const RequestSubmitDialog = {
  title: "Do you want to submit the application?",
  message:
    "Please note after submitting the application, you cannot update the application",
  okText: "request",
};

export const RecommendationRequestDialog = {
  title: "Do you want to request?",
  message: "Please note this will send an email notification.",
  okText: "request",
};

export const PromotionCycleCreateDialog = {
  title: "Do you want to create a promotion cycle?",
  message:
    "Please note that creating a promotion cycle, allowing eligible employees to apply for a promotion.",
  okText: "create",
};

export const PromotionApplicationCycleCloseDialog = {
  title: "Do you want to close the promotion application submission process?",
  message:
    "Once a promotion application is closed, leads will no longer be able to submit promotion requests.",
  okText: "Close Promotion Application",
};

export const PromotionCycleEndDialog = {
  title: "Do you want to end this promotion cycle?",
  message:
    "Please note that, Upon ending a promotion cycle, all operations associated with that specific cycle will cease.",
  okText: "End  Promotion Cycle",
};

export const UserRoleUpdate = {
  title: "Do you want to update user roles",
  okText: "Yes",
};

export const SpecialPromotionRequestSubmitDialog = {
  title: "Do you want to submit the request?",
  message:
    "Please note that after submitting the request, you will not be able to make updates",
  okText: "yes",
};

export const TimeBasedPromotionCycleSubmitDialog = {
  title: "Are you sure you want to import promotions?",
  message:
    "Employees who are eligible for promotions will be automatically assigned promotions for the coming cycle.",
  okText: "Yes",
};

export const SnackMessage = {
  success: {
    userListRetrieval: "Successfully retrieve the user list",
    userInsertion: "Successfully inserted the user",
    userUpdate: "Successfully updated the user",
    usersSync: "Successfully sync process initiated",
    userDelete: "Successfully deleted the user",
    requestForSpecialPromotion:
      "Successfully submitted the Individual Contributor Promotion request",
    leadRecommendation: "Successfully retrieved recommendations",
    saveRecommendation: "Successfully saved the recommendation",
    submitRecommendation: "Successfully submitted the recommendation",
    declineRecommendation: "Successfully declined the recommendation",

    promotionBoard:
      "[Promotion Board] Successfully retrieved promotion requests.",
    approvedRequests:
      "[Promotion Board] Successfully retrieved, approved promotion requests.",
    rejectPromotionRequests:
      "[Promotion Board] Successfully retrieved, rejected promotion requests.",
    functionalLeadRejectedRequests:
      "[Promotion Board] Successfully retrieved, functional lead rejected promotion requests.",

    createDraftPromotionRequest:
      "Successfully created a draft promotion request.",
    saveApplication: "Successfully saved the application",
    submitApplication: "Successfully submitted the application",

    approveWithdrawalRequest: "Successfully approved the withdrawal request",
    rejectWithdrawalRequest: "Successfully rejected the withdrawal request",

    loadFunctionalLeadRequests:
      "[Functional Lead] Successfully retrieved requests",
    approveFunctionalLeadRequest:
      "[Functional Lead] Successfully approved the request",
    rejectFunctionalLeadRequest:
      "[Functional Lead] Successfully rejected the request",
    approveFunctionalLeadRequests:
      "[Functional Lead] Successfully approved requests",
    rejectFunctionalLeadRequests:
      "[Functional Lead] Successfully rejected requests",

    approvePromotionBoardRequest:
      "[PromotionBoard] Successfully approved the request",
    rejectPromotionBoardRequest:
      "[PromotionBoard] Successfully rejected the request",
    approvePromotionBoardRequests:
      "[PromotionBoard] Successfully approved requests",
    rejectPromotionBoardRequests:
      "[PromotionBoard] Successfully rejected requests",
  },
  error: {
    userListRetrieval: "Error while retrieving the user list",
    userInsertion: "Error while inserting the user",
    userUpdate: "Error while updating the user",
    usersSync: "Error while syncing the users form Google Sheet",
    userDelete: "Error while deleting the user",
    requestForSpecialPromotion:
      "An error occurred while submitting the Individual Contributor Promotion",
  },
  warning: {
    requestForSpecialPromotion:
      "There is a duplicate request found for this user",
  },
};

export const UIMessages = {
  loading: {
    checkActivePromotionCycle: "Checking for active promotion cycle",
    checkEligibility: "Checking eligibility...",
  },
  emptyRecords: {
    // promotion panel
    applicationHistory: "There are no promotion requests",

    recommendationRequest: "There are no pending promotion requests.",
  },
};
