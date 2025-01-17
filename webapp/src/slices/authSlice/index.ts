// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  Role,
  AuthState,
  AuthData,
  ChoreoTokens,
  AuthFlowState,
} from "../../utils/types";
import { getAPIToken, getUserPrivileges } from "@utils/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  status: "idle",
  mode: "active",
  statusMessage: null,
  userInfo: null,
  idToken: null,
  isIdTokenExpired: null,
  decodedIdToken: null,
  roles: [],
  userPrivileges: null,
  choreoTokens: null,
  errorMessage: null,
  authFlowState: "start",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserAuthData: (state, action: PayloadAction<AuthData>) => {
      state.userInfo = action.payload.userInfo;
      state.idToken = action.payload.idToken;
      state.decodedIdToken = action.payload.decodedIdToken;
    },
    setStatus: (state, action: PayloadAction<AuthState["status"]>) => {
      state.status = action.payload;
    },
    setStatusMessage: (state, action: PayloadAction<string | null>) => {
      state.statusMessage = action.payload;
    },
    setChoreoToken: (state, action: PayloadAction<ChoreoTokens | null>) => {
      state.choreoTokens = action.payload;
    },
    setTokenState: (state) => {
      state.isIdTokenExpired = true;
    },
    setAuthFlowState: (state, action: PayloadAction<AuthFlowState>) => {
      state.authFlowState = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    checkTokenState: (state) => {
      state.isIdTokenExpired = state.decodedIdToken
        ? Date.now() >= state.decodedIdToken?.exp * 1000
        : null;
    },
    resetStates: (state) => {
      state = {
        isAuthenticated: false,
        status: "idle",
        mode: "active",
        statusMessage: null,
        userInfo: null,
        idToken: null,
        isIdTokenExpired: null,
        decodedIdToken: null,
        roles: [],
        userPrivileges: null,
        choreoTokens: null,
        errorMessage: null,
        authFlowState: "start",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadChoreoToken.pending, (state) => {
        state.status = "loading";
        state.authFlowState = "l_choreo_tokens";
      })
      .addCase(loadChoreoToken.fulfilled, (state, action) => {
        // state.status = 'idle';
        state.choreoTokens = action.payload;
        // state.isAuthenticated = true;
      })
      .addCase(loadChoreoToken.rejected, (state) => {
        state.status = "failed";
        state.authFlowState = "e_choreo_tokens";
        state.isAuthenticated = false;
      })
      .addCase(loadPrivileges.pending, (state) => {
        state.authFlowState = "l_user_privileges";
        state.status = "loading";
      })
      .addCase(loadPrivileges.fulfilled, (state, action) => {
        state.userPrivileges = action.payload;
        var roles = [];
        // appending UI roles based on user privileges
        if (action.payload.includes(987)) {
          roles.push(Role.EMPLOYEE);
        }
        if (action.payload.includes(862)) {
          roles.push(Role.LEAD);
        }
        if (action.payload.includes(562)) {
          roles.push(Role.PROMOTION_BOARD_MEMBER);
        }
        if (action.payload.includes(762)) {
          roles.push(Role.HR_ADMIN);
        }
        if (action.payload.includes(662)) {
          roles.push(Role.FUNCTIONAL_LEAD);
        }
        state.roles = roles;
        state.authFlowState = "end";
        state.isAuthenticated = true;
        state.status = "success";
      })
      .addCase(loadPrivileges.rejected, (state) => {
        state.status = "failed";
        state.authFlowState = "e_user_privileges";
        state.errorMessage = "Unable to load user privileges";
        state.isAuthenticated = false;
      });
  },
});

export const loadChoreoToken = createAsyncThunk(
  "auth/loadChoreoToken",

  async (IdToken: string, { dispatch }) => {
    dispatch(setStatusMessage("Loading User Privileges"));
    try {
      dispatch(setAuthFlowState("l_choreo_tokens"));
      var token = await getAPIToken(IdToken);
      return token;
    } catch (error: any) {
      dispatch(setStatus("failed"));
      dispatch(setAuthFlowState("e_choreo_tokens"));
      dispatch(setErrorMessage(error));
      return error;
    }
  }
);

export const loadPrivileges = createAsyncThunk(
  "auth/loadPrivileges",
  async () => {
    return getUserPrivileges();
  }
);

export const {
  setIsAuthenticated,
  setUserAuthData,
  setStatus,
  setStatusMessage,
  checkTokenState,
  setTokenState,
  resetStates,
  setAuthFlowState,
  setErrorMessage,
} = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectIdToken = (state: RootState) => state.auth.idToken;

export const selectStatus = (state: RootState) => state.auth.status;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectStatusMessage = (state: RootState) =>
  state.auth.statusMessage;
export const isIdTokenExpired = (state: RootState) =>
  state.auth.isIdTokenExpired;

export default authSlice.reducer;
