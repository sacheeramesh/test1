import React from "react";
import { styled, Theme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Toolbar from "@mui/material/Toolbar";

import { selectUserInfo } from "@slices/authSlice";
import { useSelector } from "react-redux";

import { SIDEBAR_WIDTH } from "./../../config/ui";
import { Box, Chip, Menu, MenuItem, Tooltip } from "@mui/material";

import { useAppAuthContext } from "@context/authContext";
import UserImage from "@component/ui/userImage";

interface HeaderProps {
  open: boolean;
  theme: Theme;
  title: string;
  email?: string;
}

const Header = (props: HeaderProps) => {
  const authContext = useAppAuthContext();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const userInfo = useSelector(selectUserInfo);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" open={props.open}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
            fontWeight: 300,
            fontSize: "1.0rem",
          }}
        >
          {!props.open ? "Promotion App" : ""}
        </Typography>

        {/* <Chip
          sx={{ background: "#36B37E", color: "white" }}
          label={
            <>
              env: <b> Staging</b>{" "}
            </>
          }
          style={{ borderRadius: "0px" }}
          size="medium"
        /> */}

        <IconButton size="large"></IconButton>
        <Box sx={{ flexGrow: 0 }}>
          {userInfo && userInfo.email && (
            <>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  size="small"
                  sx={{ p: 0 }}
                >
                  <UserImage
                    isRound={true}
                    email={userInfo.email}
                    size={45}
                    name={userInfo.email}
                  ></UserImage>
                  {userInfo.name}
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  key={"logout"}
                  onClick={() => {
                    authContext.appSignOut();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  marginLeft: SIDEBAR_WIDTH,
  color: "white",
  background: theme.palette.mode === "light" ? "#212A30" : "#0d0d0d",
  boxShadow: "none",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  width: `calc(100% - calc(${theme.spacing(9)} + 1px))`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: SIDEBAR_WIDTH,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
