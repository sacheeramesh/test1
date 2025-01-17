// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useContext, useEffect, useState } from "react";
import { revokeAPIToken } from "@utils/auth";
import { useIdleTimer } from "react-idle-timer";
import { Button } from "@mui/material";
import { APIService } from "@utils/apiService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useAuthContext, BasicUserInfo, SecureApp } from "@asgardeo/auth-react";

import { setUserAuthData, loadPrivileges } from "@slices/authSlice";

import { RootState, useAppDispatch, useAppSelector } from "../slices/store";
import StatusWithAction from "@component/ui/statusWithAction";
import PreLoader from "@component/common/preLoader";

type AuthContextType = {
  revokeToken: () => void;
  appSignIn: () => void;
  appSignOut: () => void;
  user: BasicUserInfo | null;
};

const timeout = 1800_000;
const promptBeforeIdle = 4_000;

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

const AppAuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BasicUserInfo | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [appState, setAppState] = useState<"logout" | "active" | "loading">(
    "loading"
  );

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const onPrompt = () => {
    appState === "active" && setOpen(true);
  };

  const { getRemainingTime, activate } = useIdleTimer({
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
  });

  const {
    signIn,
    getIDToken,
    signOut,
    getDecodedIDToken,
    getBasicUserInfo,
    revokeAccessToken,
    refreshAccessToken,
    state
  } = useAuthContext();

  useEffect(() => {
    var appStatus = localStorage.getItem("promotion-app-state");

    if (!localStorage.getItem("promotion-app-redirect-url")) {
      localStorage.setItem(
        "promotion-app-redirect-url",
        window.location.href.replace(window.location.origin, "")
      );
    }

    if (appStatus && appStatus === "logout") {
      setAppState("logout");
    } else {
      setAppState("active");
    }
  }, []);

  useEffect(() => {
    const isSignInInitiated =
      localStorage.getItem("signInInitiated") === "true";
      if (state.isAuthenticated) {
        Promise.all([getBasicUserInfo(), getIDToken(), getDecodedIDToken()]).then(
          async ([userInfo, idToken, decodedIdToken]) => {
            dispatch(
              setUserAuthData({
                userInfo: userInfo,
                idToken: idToken,
                decodedIdToken: decodedIdToken,
              })
            );
            
            new APIService(idToken, refreshTokens);
            dispatch(loadPrivileges());
            localStorage.setItem("signInInitiated", "false");
          }
        );
    } else if (!isSignInInitiated) {
      localStorage.setItem("signInInitiated", "true");
      signIn();
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (appState === "active") {
      if (state.isAuthenticated) {
        // TODO -> For thumbnail
        // if (auth.userInfo?.email && employeeInfo.state !== "loading") {
        //   dispatch(
        //     getEmployeeInfo(auth.userInfo?.email ? auth.userInfo?.email : "")
        //   );
        // }
      } else {
        signIn();
      }
    }
  }, [auth.userInfo]);

  const refreshTokens = () => {
    return new Promise<{ idToken: string }>((resolve) => {
      refreshAccessToken()
        .then(async (res) => {
          const idToken = await getIDToken();
          localStorage.setItem("cp-app-token", idToken);
          resolve({ idToken: idToken });
        })
        .catch((error) => {
          appSignOut();
        });
    });
  };

  const revokeToken = () => {
    revokeAccessToken();
  };

  const appSignOut = async () => {
    setAppState("loading");
    localStorage.setItem("promotion-app-state", "logout");
    await revokeToken();
    await signOut();
    setAppState("logout");
  };

  const appSignIn = async () => {
    setAppState("active");
    localStorage.setItem("promotion-app-state", "active");
  };

  const authContext: AuthContextType = {
    revokeToken: revokeToken,
    appSignIn: appSignIn,
    appSignOut: appSignOut,
    user: user,
  };

  return (
    <>
      {appState === "loading" ? (
        <PreLoader isLoading={true} message="" />
      ) : (
        <>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you still there?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                It looks like you've been inactive for a while. Would you like
                to continue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Continue</Button>
              <Button onClick={() => appSignOut()}>Logout</Button>
            </DialogActions>
          </Dialog>
          {appState === "active" ? (
            <AuthContext.Provider value={authContext}>
              <SecureApp>{props.children}</SecureApp>
            </AuthContext.Provider>
          ) : (
            <StatusWithAction action={() => appSignIn()} />
          )}
        </>
      )}
    </>
  );
};

const useAppAuthContext = (): AuthContextType => useContext(AuthContext);

export { useAppAuthContext };

export default AppAuthProvider;
