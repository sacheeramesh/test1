// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { createContext, useState, useMemo } from "react";

import { store } from "./slices/store";

import { AsgardeoConfig } from "./config/config";
import AppHandler from "@app/appHandler";
import { themeSettings } from "./theme";
import "./App.scss";

import { Provider } from "react-redux";
import AppAuthProvider from "@context/authContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "@asgardeo/auth-react";
import { SnackbarProvider } from "notistack";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const processLocalThemeMode = (): "light" | "dark" => {
    var localMode: string | null = localStorage.getItem("promotion-app-theme");

    if (localMode && ["light", "dark"].indexOf(localMode) > -1) {
      return ["light", "dark"].indexOf(localMode) === 0 ? "light" : "dark";
    } else {
      localStorage.setItem("promotion-app-theme", "light");
      return "light";
    }
  };

  const [mode, setMode] = useState<"light" | "dark">(processLocalThemeMode());

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        localStorage.setItem(
          "promotion-app-theme",
          mode === "light" ? "dark" : "light"
        );
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <SnackbarProvider maxSnack={3} preventDuplicate>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <AuthProvider config={AsgardeoConfig}>
              <AppAuthProvider>
                <AppHandler />
              </AppAuthProvider>
            </AuthProvider>
          </Provider>
        </ThemeProvider>
      </SnackbarProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
