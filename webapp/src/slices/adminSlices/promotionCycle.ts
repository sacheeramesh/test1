import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";

import { PromotionCycleManageState, ActivePromotionCycleInterface, PromotionRequest, EmployeeInfo } from "@utils/types";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";
import { AxiosError } from "axios";

const initialState: PromotionCycleManageState = {
  state: "idle",
  stateMessage: null,

  stat_state: "idle",
  stat_stateMessage: null,

  errorMessage: null,
  activePromotionCycle: null,
  promotionRequests: null,
  backgroundProcess: false,
  backgroundProcessMessage: null,
  users: [],
  currentEditId: null,
};

export const getActivePromotionCycle = createAsyncThunk(
  "promotion-cycle-manage/getActivePromotionCycle",
  async (_, { dispatch }) => {
    return new Promise<{
      promotionCycle: ActivePromotionCycleInterface | null;
    }>((resolve, reject) => {
      Promise.all([
        APIService.getInstance().get<{
          promotionCycles: ActivePromotionCycleInterface[];
        }>(AppConfig.serviceUrls.getActivePromotionCycle),
        APIService.getInstance().get<{
          promotionCycles: ActivePromotionCycleInterface[];
        }>(AppConfig.serviceUrls.getClosePromotionCycle),
      ])
        .then(([open, close]) => {
          if (
            open.data.promotionCycles &&
            open.data.promotionCycles.length > 0
          ) {
            resolve({
              promotionCycle: open.data.promotionCycles[0],
            });
          } else if (
            close.data.promotionCycles &&
            close.data.promotionCycles.length > 0
          ) {
            resolve({
              promotionCycle: close.data.promotionCycles[0],
            });
          } else {
            resolve({
              promotionCycle: null,
            });
          }
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
);

export const getAllPromotionRequests = createAsyncThunk(
  "promotion-cycle-manage/getAllPromotionRequests",
  async (cycleId : number, { dispatch }) => {
    return new Promise<{ promotionRequests: PromotionRequest[] }>(
      (resolve, reject) => {
        APIService.getInstance()
          .get<{ promotionRequests: PromotionRequest[] }>(
            AppConfig.serviceUrls.retrieveAllPromotionRequests +
              "?cycleId="+cycleId
          )
          .then((resp) => {
            var HistoryRequests: any[] = [];
            resp.data.promotionRequests.map((request: PromotionRequest) => {
              HistoryRequests.push(
                APIService.getInstance().get<{
                  employeeInfo: EmployeeInfo;
                }>(
                  AppConfig.serviceUrls.getEmployeeHistory +
                    "?employeeWorkEmail=" +
                    request.employeeEmail
                )
              );
            });

            Promise.all(HistoryRequests)
              .then((histories) => {
                resp.data.promotionRequests.forEach((value, index) => {
                  var history = histories[index];
                  if (history) {
                    value.lastPromotedDate =
                      history.data.employeeInfo.lastPromotedDate;
                    value.joinDate = history.data.employeeInfo.startDate;
                    value.location = history.data.employeeInfo.joinedLocation;
                    value.employeeImageUrl =
                      history.data.employeeInfo.employeeThumbnail;
                  }
                });

                resolve(resp.data);
              })
              .catch((error: AxiosError) => {
                dispatch(
                  enqueueSnackbarMessage({
                    message:
                      error.response?.status === 500
                        ? String(error.response?.data)
                        : "Unable to refresh promotion requests",
                    type: "error",
                  })
                );
                reject(error);
              });
          })
          .catch((error: AxiosError) => {
            dispatch(
              enqueueSnackbarMessage({
                message:
                  error.response?.status === 500
                    ? String(error.response?.data)
                    : "Unable to get promotion requests",
                type: "error",
              })
            );
            reject(error);
          });
      }
    );
  }
);

export const createPromotionCycle = createAsyncThunk(
  "promotion/createPromotionCycle",
  async (
    payload: { name: string; startDate: string; endDate: string },
    { dispatch }
  ) => {
    return new Promise<ActivePromotionCycleInterface>((resolve, reject) => {
      APIService.getInstance()
        .post(AppConfig.serviceUrls.createPromotionCycle, payload)
        .then((resp) => {
          if (resp.status === 201) {
            dispatch(
              enqueueSnackbarMessage({
                message: "Successfully created promotion cycle",
                type: "success",
              })
            );
            resolve(resp.data);
          } else {
            enqueueSnackbarMessage({
              message: "Unable create promotion cycle",
              type: "error",
            });
            reject("failed");
          }
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to create promotion cycle",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const closePromotionCycle = createAsyncThunk(
  "promotion/closePromotionCycle",
  async (id: number, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      APIService.getInstance()
        .get(AppConfig.serviceUrls.basePathPromotionCycle + "/" + id + "/close")
        .then((resp) => {
          dispatch(
            enqueueSnackbarMessage({
              message: resp.data.status,
              type: "success",
            })
          );
          resolve("success");
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to close promotion cycle",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const endPromotionCycle = createAsyncThunk(
  "promotion/endPromotionCycle",
  async (id: number,{dispatch}) => {
    return new Promise<string>((resolve, reject) => {
      APIService.getInstance()
        .get(AppConfig.serviceUrls.basePathPromotionCycle + "/" + id + "/end")
        .then((resp) => {
          dispatch(
            enqueueSnackbarMessage({
              message: resp.data.status,
              type: "success",
            })
          );
          resolve("success");
        })
        .catch((error: AxiosError) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === 500
                  ? String(error.response?.data)
                  : "Unable to end promotion cycle",
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const PromotionCycleManageCycle = createSlice({
  name: "promotion-cycle-manage",
  initialState,
  reducers: {
    setCurrentEdit: (state, action: PayloadAction<number | null>) => {
      state.currentEditId = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    //getting withdrawal request
    builder
      .addCase(getActivePromotionCycle.pending, (state, action) => {
        state.stateMessage = "Loading Active Promotion Cycle";
        state.state = "loading";
      })
      .addCase(getActivePromotionCycle.fulfilled, (state, action) => {
        state.activePromotionCycle = action.payload.promotionCycle;
        state.state = "success";
      })
      .addCase(getActivePromotionCycle.rejected, (state, action) => {
        state.state = "failed";
      });

    //getting withdrawal request
    builder

      // Create Promotion Cycle
      .addCase(createPromotionCycle.pending, (state) => {
        state.stateMessage = " Creating Promotion Cycle";
        state.state = "loading";
      })
      .addCase(createPromotionCycle.fulfilled, (state, action) => {
        state.activePromotionCycle = action.payload;
        state.state = "success";
      })
      .addCase(createPromotionCycle.rejected, (state) => {
        state.state = "failed";
      })

      // Ending Promotion Cycle
      .addCase(endPromotionCycle.pending, (state) => {
        state.stateMessage = " Ending Promotion Cycle";
        state.state = "loading";
      })
      .addCase(endPromotionCycle.fulfilled, (state, action) => {
        state.activePromotionCycle = null;
        state.state = "success";
      })
      .addCase(endPromotionCycle.rejected, (state) => {
        state.state = "failed";
      })

      // Ending Promotion Cycle
      .addCase(closePromotionCycle.pending, (state) => {
        state.stateMessage = " Closing Promotion Cycle";
        state.state = "loading";
      })
      .addCase(closePromotionCycle.fulfilled, (state, action) => {
        if (state.activePromotionCycle) {
          state.activePromotionCycle.status = "CLOSED";
        }

        state.state = "success";
      })
      .addCase(closePromotionCycle.rejected, (state) => {
        state.state = "failed";
      })
    
      // Ending Promotion Cycle
      .addCase(getAllPromotionRequests.pending, (state) => {
        state.stat_stateMessage = "Loading Stat";
        state.stat_state = "loading";
      })
      .addCase(getAllPromotionRequests.fulfilled, (state, action) => {
        state.promotionRequests = action.payload.promotionRequests;
        state.stat_state = "success";
      })
      .addCase(getAllPromotionRequests.rejected, (state) => {
        state.stat_state = "failed";
      })
  },
});

export const { setCurrentEdit } = PromotionCycleManageCycle.actions;

export default PromotionCycleManageCycle.reducer;
