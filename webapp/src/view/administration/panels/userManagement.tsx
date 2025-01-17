import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";
import UserLine from "@component/user/userLine";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

import { Cached, FileOpen, Link, PersonAdd } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";
import UserFormDialog from "@component/dialog/userFormDialog";

import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import {
  getAllUsers,
  checkSyncState,
  setDialogOpenState,
  syncUsers,
  setSyncState,
} from "@slices/adminSlices/users";
import React from "react";
import { Employee, SyncState, User } from "@utils/types";

import TreeACL from "@component/ui/treeACL";
import { updateUser } from "@slices/adminSlices/users";
import EmployeeSelector from "@component/forms/components/employeeSelector";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import Search from "@component/ui/search";

export default function UserManagement() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    type: "access-level" | "transfer-access" | "upload-users" | null;
    user: User | null;
  }>({
    open: false,
    type: null,
    user: null,
  });
  const [transferUser, setTransferUser] = React.useState<string | null>(null);
  const admin_users = useAppSelector((state: RootState) => state.admin_users);

  const [searchKey, setSearchKey] = React.useState<string>("");

  const onChangeSearchKey = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSearchKey(value);
  };

  const [googleSheetURL, setGoogleSheetURL] = React.useState<{
    url: string;
    valid: boolean;
  } | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (admin_users.state !== 'loading') {
      dispatch(checkSyncState());
      dispatch(getAllUsers());
    }
  }, []);

  useEffect(() => {
    if (admin_users.syncState === SyncState.SUCCESS) {
      dispatch(
        enqueueSnackbarMessage({
          message: "Successfully synchronized the user data",
          type: "success",
        })
      );
      dispatch(setSyncState(SyncState.IDLE));
      dispatch(getAllUsers());
    }

    if (admin_users.syncState === SyncState.ERROR) {
      dispatch(
        enqueueSnackbarMessage({
          message:
            "Unable to synchronize the user data. Please contact the app support",
          type: "error",
        })
      );
      dispatch(setSyncState(SyncState.IDLE));
    }
  }, [admin_users.syncState, dispatch]);

  const openDialog = (
    user: User | null,
    type: "access-level" | "transfer-access" | "upload-users"
  ) => {
    setDialogState({
      open: true,
      type: type,
      user: user,
    });
  };

  const closeDialog = () => {
    setDialogState({
      open: false,
      type: null,
      user: null,
    });
    setTransferUser(null);
  };

  const urlPatternValidation = (URL: string) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };

  const changeUrl = (event: { target: { value: any } }) => {
    const { value } = event.target;
    const isTrueVal = value && urlPatternValidation(value);
    setGoogleSheetURL({ url: value, valid: isTrueVal });
  };

  return (
    <>
      {/* Sync User Dialog*/}
      <Dialog
        onClose={closeDialog}
        open={dialogState.open && dialogState.type === "upload-users"}
      >
        <DialogTitle>Google Sheet User Data Synchronization</DialogTitle>

        <Box
          sx={{ padding: "0px 25px", paddingBottom: "30px", width: "400px" }}
        >
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="input-with-icon-adornment">
              Google Sheet URL
            </InputLabel>
            <Input
              fullWidth
              id="input-with-icon-adornment"
              onChange={changeUrl}
              value={googleSheetURL ? googleSheetURL.url : ""}
              startAdornment={
                <InputAdornment position="start">
                  <Link />
                </InputAdornment>
              }
            />
            {googleSheetURL !== null && !googleSheetURL.valid && (
              <FormHelperText>
                {googleSheetURL.url === ""
                  ? "Insert Google Sheet URL"
                  : "Invalid Sheet URL"}
              </FormHelperText>
            )}
          </FormControl>

          {googleSheetURL?.valid && (
            <ButtonGroup sx={{ padding: "10px 0px" }}>
              <Button
                variant="contained"
                onClick={() => {
                  googleSheetURL && dispatch(syncUsers(googleSheetURL.url));
                  closeDialog();
                }}
              >
                Sync
              </Button>
            </ButtonGroup>
          )}
        </Box>
      </Dialog>

      {/* transfer access dialog */}
      <Dialog
        onClose={closeDialog}
        open={dialogState.open && dialogState.type === "transfer-access"}
      >
        <DialogTitle>Transfer Access</DialogTitle>
        {dialogState.user && (
          <Box
            sx={{ padding: "0px 25px", paddingBottom: "30px", width: "400px" }}
          >
            <Typography variant="h6">
              From : {dialogState.user.email}
            </Typography>
            <Typography variant="h6">
              To :{transferUser ? transferUser : "<Select User>"}
            </Typography>
            <EmployeeSelector
              setValue={(value: Employee | null) =>
                setTransferUser(value ? value.workEmail : null)
              }
              isLeadsOnly={true}
            />

            {dialogState.user && transferUser && (
              <ButtonGroup sx={{ padding: "10px 0px" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    dialogState.user &&
                      dispatch(
                        updateUser({
                          id: dialogState.user.id,
                          email: transferUser,
                          roles: dialogState.user.roles,
                          functionalLeadAccessLevels:
                            dialogState.user.functionalLeadAccessLevels,
                        })
                      );
                    closeDialog();
                  }}
                >
                  Transfer
                </Button>
              </ButtonGroup>
            )}
          </Box>
        )}
      </Dialog>

      {/* access level dialog */}
      <Dialog
        onClose={closeDialog}
        open={dialogState.open && dialogState.type === "access-level"}
      >
        <DialogTitle>Access Levels</DialogTitle>
        <Box sx={{ padding: "0px 20px", width: "400px" }}>
          {dialogState.user && (
            <TreeACL
              data={
                dialogState.user.functionalLeadAccessLevels
                  ? dialogState.user.functionalLeadAccessLevels.businessUnits
                  : []
              }
            />
          )}
        </Box>
      </Dialog>

      <UserFormDialog />
      <BackgroundLoader
        open={admin_users.backgroundProcess}
        message={admin_users.backgroundProcessMessage}
      />
      {admin_users.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            marginBottom: "10px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <ButtonGroup>
            <Tooltip title="Refresh Page">
              <IconButton size="small" onClick={() => dispatch(getAllUsers())}>
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
          <Typography variant="h5" sx={{ flex: 1 }}>
            {" "}
          </Typography>
          {admin_users.syncState === SyncState.IN_PROGRESS && (
            <InProgressLabel />
          )}
          <ButtonGroup>
            <Search value={searchKey} onChange={onChangeSearchKey} />
            <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
            <Tooltip title="Import users form google sheet">
              <IconButton
                disabled={admin_users.syncState === SyncState.IN_PROGRESS}
                size="small"
                onClick={() => openDialog(null, "upload-users")}
              >
                <FileOpen />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add a new user">
              <IconButton
                sx={{ ml: 1 }}
                disabled={admin_users.syncState === SyncState.IN_PROGRESS}
                size="small"
                onClick={() => dispatch(setDialogOpenState(null))}
              >
                <PersonAdd />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}
      <Box
        className="panel-con"
        sx={{
          height: "calc(100vh - 404px)",
          minHeight: "calc(544px)",
        }}
      >
        {admin_users.state === "loading" && (
          <LoadingEffect message={admin_users.stateMessage || ""} />
        )}

        {admin_users.state === "success" &&
          admin_users.users
            .filter((user) =>
              searchKey === ""
                ? true
                : (user.firstName + user.lastName)
                    .toLowerCase()
                    .includes(searchKey.toLowerCase())
            )
            .map((user) => {
              return (
                <UserLine
                  key={user.id}
                  user={user}
                  openAccessLevel={() => openDialog(user, "access-level")}
                  transferAccess={() => openDialog(user, "transfer-access")}
                />
              );
            })}

        {admin_users.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Unable to load user information !"
          />
        )}
      </Box>
    </>
  );
}

export function InProgressLabel() {
  const dispatch = useAppDispatch();
  const syncState = useAppSelector(
    (state: RootState) => state.admin_users.syncState
  );

  useEffect(() => {
    var intervalFunc = setInterval(() => {
      dispatch(checkSyncState());
    }, 2000);

    return () => {
      clearInterval(intervalFunc);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "200px",
        marginRight: "20px",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        <LinearProgress />
      </div>
      <div
        style={{
          flex: 2.5,
          marginLeft: "20px",
          color: "gray",
        }}
      >
        Data Synchronizing{" "}
      </div>
    </div>
  );
}
