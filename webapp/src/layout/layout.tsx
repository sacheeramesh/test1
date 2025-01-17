import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Header from "./header";
import Sidebar, { DrawerHeader } from "./sidebar";
import {
  Outlet,
  useLocation,
  useNavigate,
  matchRoutes,
} from "react-router-dom";
import { routes } from "../route";

import ConfirmationModalContextProvider from "@context/dialogContext";
import { selectUserInfo, selectRoles } from "@slices/authSlice";
import { useSnackbar } from "notistack";
import pJson from "../../package.json";
import { RootState, useAppSelector } from "@slices/store";
import { Typography } from "@mui/material";

export default function Layout() {
  //snackbar configuration
  const { enqueueSnackbar } = useSnackbar();
  const common = useAppSelector((state: RootState) => state.common);
  const navigate = useNavigate();
  useEffect(() => {
    if (common.timestamp != null) {
      enqueueSnackbar(common.message, {
        variant: common.type,
        preventDuplicate: true,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  }, [common.timestamp]);

  useEffect(() => {
    if (localStorage.getItem("promotion-app-redirect-url")) {
      navigate(localStorage.getItem("promotion-app-redirect-url") as string);
      localStorage.removeItem("promotion-app-redirect-url");
    }
  }, []);

  const location = useLocation();
  const matches = matchRoutes(routes, location.pathname);
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const roles = useSelector(selectRoles);
  const userInfo = useSelector(selectUserInfo);

  const getAppBarTitle = (): string => {
    var title: string = "";
    matches?.forEach((obj) => {
      if (location.pathname === obj.pathname) {
        title = obj.route.text;
      }
    });

    return title;
  };

  return (
    <ConfirmationModalContextProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Sidebar
          roles={roles}
          currentPath={location.pathname}
          open={open}
          handleDrawer={() => setOpen(!open)}
          theme={theme}
        />
        <Header
          theme={theme}
          title={getAppBarTitle()}
          open={open}
          email={userInfo?.email}
        />

        <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100vh" }}>
          <DrawerHeader open={open} />
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
          <Box
            className="layout-note"
            sx={{
              background:
                theme.palette.mode === "light" ? "#eeeeee" : "#0d0d0d",
            }}
          >
            <Typography variant="h6" sx={{ color: "#919090" }}>
              v {pJson.version} | © 2024 WSO2 LLC
            </Typography>
          </Box>
        </Box>
      </Box>
    </ConfirmationModalContextProvider>
  );
}
