import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VariantType } from "notistack";

import { AppDispatch } from "@slices/store";
import { APIService } from "@utils/apiService";
import { AppConfig } from "@config/config";
import { CommonEmployeesState, Employee } from "@utils/types";

const initialState: CommonEmployeesState = {
  state: "idle",
  stateMessage: null,
  employees: [],
  backgroundProcess: false,
  backgroundProcessMessage: null,
};

export const getEmployeeList = createAsyncThunk(
  "common_employee_list/getAllEmployee",
  async (isLeadsOnly: boolean, { dispatch }) => {
    return new Promise<{ employees: Employee[] }>((resolve, reject) => {
      APIService.getInstance()
        .get<{ employees: Employee[] }>(
          AppConfig.serviceUrls.retrieveEmployeeList +
            "?filterLeads=" +
            isLeadsOnly
        )
        .then((resp) => {
          var employees: Employee[] = [];

          //select employee with unique email address
          resp.data.employees.forEach((employee) => {
            if (
              employees.findIndex(
                (emp) => emp.workEmail === employee.workEmail
              ) === -1
            ) {
              employees.push(employee);
            }
          });
          resolve({ employees });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
);

export const CommonUserListSlice = createSlice({
  name: "common-user-list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeList.pending, (state) => {
        state.stateMessage = " Loading User Details";
        state.state = "loading";
      })
      .addCase(getEmployeeList.fulfilled, (state, action) => {
        state.employees = action.payload.employees;
        state.state = "success";
      })
      .addCase(getEmployeeList.rejected, (state) => {
        state.state = "failed";
        state.employees = [];
      });
  },
});

export const {} = CommonUserListSlice.actions;

export default CommonUserListSlice.reducer;
