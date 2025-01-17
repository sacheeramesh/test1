import {
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

import { Role, SyncState, User } from "@utils/types";
import ToggleButton from "@mui/material/ToggleButton";
import {
  AccountTree,
  Edit,
  Face,
  TransferWithinAStation,
} from "@mui/icons-material";

import {
  updateUser,
  setDialogOpenState,
  deleteUser,
} from "@slices/adminSlices/users";
import { RootState, useAppSelector, useAppDispatch } from "@slices/store";

import { useConfirmationModalContext } from "@context/dialogContext";
import UserImage from "@component/ui/userImage";

function UserLine(props: {
  user: User;
  openAccessLevel: () => void;
  transferAccess: () => void;
}) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const syncState = useAppSelector(
    (state: RootState) => state.admin_users.syncState
  );
  const dialogContext = useConfirmationModalContext();

  return (
    <Grid item xs={12} key={props.user?.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "auto",
          border: "1px dashed #e3e3e3",
          p: 2,
          marginBottom: "10px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={0.5}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <UserImage
              size={50}
              name={props.user.firstName}
              email={props.user.email}
              variant="rounded"
            />
          </Grid>
          <Grid
            item
            xs={2.5}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">
              {props.user.firstName} {props.user.lastName} (
              {props.user.email === auth.userInfo?.email ? (
                <b>{props.user.email}</b>
              ) : (
                props.user.email
              )}
              )
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {props.user.roles.map((role) => {
                  return (
                    <Chip
                      icon={<Face />}
                      key={role}
                      label={role}
                      sx={{ m: "2px", background: getColor(role) }}
                    />
                  );
                })}
              </Box>
            </>
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
              {props.user.roles.includes(Role.FUNCTIONAL_LEAD) && (
                <Tooltip title="Functional Lead Access Levels" arrow>
                  <IconButton onClick={() => props.openAccessLevel()}>
                    <AccountTree />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Transfer Access" arrow>
                <IconButton onClick={() => props.transferAccess()}>
                  <TransferWithinAStation />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
              <ToggleButtonGroup
                disabled={syncState === SyncState.IN_PROGRESS}
                color="primary"
                value={props.user.active ? "active" : "in-active"}
                exclusive
                aria-label="Platform"
              >
                <ToggleButton
                  disabled={props.user.active}
                  value="active"
                  onClick={() => {
                    dialogContext.showConfirmation(
                      "Are you sure do you want to activate this user?",

                      <Typography variant="h4">
                        Do you want to <i>activate</i> <b>{props.user.email}</b>{" "}
                        ?
                      </Typography>,
                      () => {
                        dispatch(
                          updateUser({
                            id: props.user.id,
                            active: true,
                            functionalLeadAccessLevels:
                              props.user.functionalLeadAccessLevels,
                            roles: props.user.roles,
                          })
                        );
                      },
                      "Yes"
                    );
                  }}
                >
                  Active
                </ToggleButton>
                <ToggleButton
                  value="in-active"
                  disabled={!props.user.active}
                  onClick={() => {
                    dialogContext.showConfirmation(
                      "Are you sure do you want to deactivate this user?",

                      <Typography variant="h4">
                        Do you want to <i>deactivate</i>{" "}
                        <b>{props.user.email}</b> ?
                      </Typography>,
                      () => {
                        dispatch(
                          updateUser({
                            id: props.user.id,
                            active: false,
                            functionalLeadAccessLevels:
                              props.user.functionalLeadAccessLevels,
                            roles: props.user.roles,
                          })
                        );
                      },
                      "Yes"
                    );
                  }}
                >
                  Inactive
                </ToggleButton>
              </ToggleButtonGroup>
              <IconButton
                disabled={syncState === SyncState.IN_PROGRESS}
                onClick={() => {
                  dialogContext.showConfirmation(
                    "Are you sure do you want to remove the user?",

                    <Typography variant="h4">
                      Do you want to <i> remove </i> &nbsp;
                      <b>{props.user.email}</b> ?
                    </Typography>,
                    () => {
                      dispatch(deleteUser(props.user.id));
                    },
                    "Yes"
                  );
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                disabled={syncState === SyncState.IN_PROGRESS}
                onClick={() => {
                  dispatch(setDialogOpenState(props.user));
                }}
              >
                <Edit />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default UserLine;

const getColor = (role: Role) => {
  if (role === Role.HR_ADMIN) {
    return "#FF5630";
  } else if (role === Role.FUNCTIONAL_LEAD) {
    return "#FFAB00";
  } else if (role === Role.LEAD) {
    return "#36B37E";
  } else if (role === Role.PROMOTION_BOARD_MEMBER) {
    return "#ababab";
  } else if (role === Role.EMPLOYEE) {
    return "#00875A";
  } else {
    return "#0052CC";
  }
};
