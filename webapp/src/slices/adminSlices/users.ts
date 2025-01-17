import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { SnackMessage } from "@config/constant";

import {
  BUAccessLevel,
  SyncState,
  UpdateUser,
  User,
  UserInsertInterface,
  UsersState,
} from "@utils/types";

import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";

const initialState: UsersState = {
  state: "idle",
  stateMessage: null,

  syncState: SyncState.IDLE,
  syncStateMessage: null,

  errorMessage: null,
  currentEditUser: null,

  backgroundProcess: false,
  backgroundProcessMessage: null,

  users: [],
  businessUnits: [],

  currentEditId: null,

  isOpenInsertDialog: false,
};

export const getAllUsers = createAsyncThunk(
  "admin_users/getAllUsers",
  async (_, { dispatch }) => {
    return new Promise<{ users: User[]; businessUnits: BUAccessLevel[] }>(
      (resolve, reject) => {
        Promise.all([
          APIService.getInstance().get<{ users: User[] }>(
            AppConfig.serviceUrls.userBaseUrl
          ),
          APIService.getInstance().get<{ businessUnits: BUAccessLevel[] }>(
            AppConfig.serviceUrls.retrieveBusinessUnits
          ),
        ])
          .then(([users, buAccessLevel]) => {
            resolve({
              users: users.data.users,
              businessUnits: buAccessLevel.data.businessUnits,
            });
          })
          .catch((error: Error) => {
            dispatch(
              enqueueSnackbarMessage({
                message: SnackMessage.error.userListRetrieval,
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const insertUser = createAsyncThunk(
  "admin_users/saveUser",
  async (user: UserInsertInterface, { dispatch }) => {
    return new Promise<{ users: User[] }>((resolve, reject) => {
      APIService.getInstance()
        .post(AppConfig.serviceUrls.userBaseUrl, user)
        .then((resp) => {
          APIService.getInstance()
            .get<{ users: User[] }>(AppConfig.serviceUrls.userBaseUrl)
            .then((resp) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: SnackMessage.success.userInsertion,
                  type: "success",
                })
              );
              resolve(resp.data);
            })
            .catch((error: AxiosError) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: error.response?.status === 500 ? String(error.response?.data) : "Unable to refresh user list",
                  type: "error",
                })
              );
              reject(error);
            });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message: error.response?.status === 500 ? String(error.response?.data) : "Unable to refresh user list",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const updateUser = createAsyncThunk(
  "admin_users/updateUser",
  async (updateUser: UpdateUser, { dispatch }) => {
    return new Promise<{ users: User[] }>((resolve, reject) => {
      APIService.getInstance()
        .patch(AppConfig.serviceUrls.userBaseUrl, updateUser)
        .then((resp) => {
          APIService.getInstance()
            .get<{ users: User[] }>(AppConfig.serviceUrls.userBaseUrl)
            .then((resp) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: SnackMessage.success.userUpdate,
                  type: "success",
                })
              );
              resolve(resp.data);
            })
            .catch((error: AxiosError) => {
              dispatch(
                enqueueSnackbarMessage({
                  message: error.response?.status === 500 ? String(error.response?.data) : "Unable to refresh user list",
                  type: "error",
                })
              );
              reject(error);
            });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message: error.response?.status === 500 ? String(error.response?.data) : "Unable to update the user",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const deleteUser = createAsyncThunk(
  "admin_users/deleteUser",
  async (id: number, { dispatch }) => {
    return new Promise<{ id: number }>((resolve, reject) => {
      APIService.getInstance()
        .delete(AppConfig.serviceUrls.userBaseUrl + "/" + id)
        .then((resp) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.userDelete,
              type: "success",
            })
          );
          resolve({
            id: id,
          });
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message: error.response?.status === 500 ? String(error.response?.data) : "Unable to delete user data",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const syncUsers = createAsyncThunk(
  "admin_users/syncUsers",
  async (googleSheetURL: string, { dispatch }) => {
    return new Promise((resolve, reject) => {
      APIService.getInstance()
        .get(
          AppConfig.serviceUrls.businessUnitSync +
            "?googleSheet=" +
            googleSheetURL
        )
        .then((resp) => {
          dispatch(
            enqueueSnackbarMessage({
              message: resp.data.status,
              type: "success",
            })
          );
          resolve(resp.data);
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message: error.response?.status === 500 ? String(error.response?.data) : "Unable to sync user data",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const checkSyncState = createAsyncThunk(
  "admin_users/checkSyncStatus",
  async (_, { dispatch }) => {
    return new Promise<{ state: SyncState }>((resolve, reject) => {
      APIService.getInstance()
        .get(AppConfig.serviceUrls.getConfigs+"?key=SYNC_STATE")
        .then((resp) => {
          if (resp.status === 200 && resp.data.appConfigs && resp.data.appConfigs.length > 0) {
            resolve({ state: resp.data.appConfigs[0].value as SyncState });
          } else {
            dispatch(
              enqueueSnackbarMessage({
                message: "Unable to read configurations",
                type: "error",
              })
            );
          }
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message: error.response?.status === 500 ? String(error.response?.data) : "Unable to read configurations",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const AdminUsersSlice = createSlice({
  name: "admin/users",
  initialState,
  reducers: {
    setCurrentEdit: (state, action: PayloadAction<number | null>) => {
      state.currentEditId = action.payload;
    },
    setDialogOpenState: (state, action: PayloadAction<User | null>) => {
      state.isOpenInsertDialog = !state.isOpenInsertDialog;

      if (!state.isOpenInsertDialog) {
        state.currentEditUser = null;
      } else {
        state.currentEditUser = action.payload;
      }
    },
    setSyncState: (state, action: PayloadAction<SyncState>) => {
      state.syncState = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      // Get All User List
      .addCase(getAllUsers.pending, (state) => {
        state.stateMessage = " Loading User Details";
        state.state = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.businessUnits = action.payload.businessUnits;
        state.state = "success";
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.state = "failed";
      })

      // Inserting new User
      .addCase(insertUser.pending, (state) => {
        state.backgroundProcessMessage = "Inserting new user";
        state.backgroundProcess = true;
        state.isOpenInsertDialog = false;
      })
      .addCase(insertUser.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.backgroundProcess = false;
        state.backgroundProcessMessage = null;
      })
      .addCase(insertUser.rejected, (state) => {
        state.backgroundProcess = false;
      })

      //Update
      .addCase(updateUser.pending, (state) => {
        state.backgroundProcess = true;
        state.backgroundProcessMessage = "Updating Changes";
        state.isOpenInsertDialog = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        // updating Roles
        state.users = action.payload.users;
        state.backgroundProcess = false;
        state.backgroundProcessMessage = null;
      })
      .addCase(updateUser.rejected, (state) => {
        state.backgroundProcess = false;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.backgroundProcess = true;
        state.backgroundProcessMessage = "Removing User...";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );

        state.currentEditId = null;
        state.backgroundProcess = false;
        state.backgroundProcessMessage = null;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.backgroundProcess = false;
      })

      // Sync Users
      .addCase(syncUsers.pending, (state) => {
        state.backgroundProcess = true;
        state.backgroundProcessMessage = "Synchronizing Users...";
      })
      .addCase(syncUsers.fulfilled, (state, action) => {
        state.syncState = SyncState.IN_PROGRESS;
        state.backgroundProcess = false;
        state.backgroundProcessMessage = null;
      })
      .addCase(syncUsers.rejected, (state) => {
        state.backgroundProcess = false;
      })

      // Sync State Checker
      .addCase(checkSyncState.pending, (state) => {})
      .addCase(checkSyncState.fulfilled, (state, action) => {
        if (!(state.syncState === SyncState.IDLE && action.payload.state === SyncState.SUCCESS)) { 
          state.syncState = action.payload.state;
        }
      })
      .addCase(checkSyncState.rejected, (state) => {});
  },
});

export const { setCurrentEdit, setDialogOpenState,setSyncState } = AdminUsersSlice.actions;

export default AdminUsersSlice.reducer;
