import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { LoadingButton } from "@mui/lab";

import RoleSelector from "./components/roleSelect";
import { Collapse, Divider, Grid, Typography } from "@mui/material";
import { Role, BUAccessLevel, User, Employee } from "@utils/types";
import { updateUser } from "@slices/adminSlices/users";

import FunctionalLeadACLSelector from "@component/forms/components/functionalLeadACLSelector";

import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import EmployeeSelector from "./components/employeeSelector";
import UserImage from "@component/ui/userImage";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("invalid email")
    .required("email is a required field"),
  roles: yup.array(yup.string()).min(1),
});

export default function UserEditForm(props: { data?: User }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const currentEditUser = useAppSelector(
    (state: RootState) => state.admin_users.currentEditUser
  );

  const formik = useFormik<{
    email: string;
    roles: Role[];
    fl_acl: BUAccessLevel[];
  }>({
    initialValues: {
      email: currentEditUser?.email ? currentEditUser?.email : "",
      roles: currentEditUser ? currentEditUser.roles : [],
      fl_acl:
        currentEditUser && currentEditUser.functionalLeadAccessLevels !== null
          ? currentEditUser.functionalLeadAccessLevels.businessUnits
          : [],
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      if (
        values.roles.includes(Role.FUNCTIONAL_LEAD) &&
        values.fl_acl.length === 0
      ) {
        setError("Please configure functional lead access levels");
      } else {
        if (currentEditUser) {
          dispatch(
            updateUser({
              id: currentEditUser.id,
              email: values.email,
              roles: values.roles,
              functionalLeadAccessLevels:
                values.roles.includes(Role.FUNCTIONAL_LEAD) &&
                values.fl_acl.length > 0
                  ? {
                      businessUnits: values.fl_acl,
                    }
                  : null,
            })
          );
        }
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} justifyContent="left" alignItems="center">
          <Grid item xs={2}>
           
          </Grid>
          <Grid
            item
            xs={10}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              margin: "10px 0px",
              marginBottom: "2px",
            }}
          >
            
              {
                currentEditUser?.email && <UserImage
                  email={currentEditUser?.email}
                  size={150}
                  name={currentEditUser?.firstName + " " + currentEditUser?.lastName}
                />
              }
            
          </Grid>
          <Grid item xs={2}></Grid>
            <Grid
              item
              xs={10}
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                marginBottom: "0px",
              }}
            >
              <Typography variant="h5" >
                {currentEditUser?.firstName + " " + currentEditUser?.lastName}
              </Typography>
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
            Lead Email
          </Grid>
          <Grid item xs={6}>
            <EmployeeSelector
              disabled
              value={
                currentEditUser
                  ? {
                      employeeThumbnail: currentEditUser.employeeThumbnail,
                      workEmail: currentEditUser.email,
                      firstName: currentEditUser.firstName,
                      lastName: currentEditUser.lastName,
                      jobBand: currentEditUser.jobBand
                        ? currentEditUser.jobBand
                        : 0,
                    }
                  : null
              }
              setValue={(value: Employee | null) =>
                formik.setFieldValue("email", value)
              }
              isLeadsOnly={true}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="left" alignItems="center">
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            Roles <span style={{ color: "red" }}>*</span>
          </Grid>
          <Grid item xs={6}>
            <RoleSelector
              data={currentEditUser ? currentEditUser.roles : []}
              setValue={(value: Role[]) => formik.setFieldValue("roles", value)}
            />
            {formik.errors.roles && (
              <span style={{ color: "red" }}>{formik.errors.roles}</span>
            )}
          </Grid>
        </Grid>
        <Collapse
          in={
            formik.values.roles.length > 0 &&
            formik.values.roles.includes(Role.FUNCTIONAL_LEAD)
          }
        >
          <Divider sx={{ m: "10px" }} />
          <Grid
            container
            spacing={2}
            justifyContent="left"
            alignItems="flex-start"
          >
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              BU ALC
            </Grid>
            <Grid item xs={10} sx={{ pl: 10 }}>
              <FunctionalLeadACLSelector
                data={
                  currentEditUser?.functionalLeadAccessLevels &&
                  currentEditUser?.functionalLeadAccessLevels.businessUnits
                    ? currentEditUser?.functionalLeadAccessLevels.businessUnits
                    : []
                }
                setValue={(value: BUAccessLevel[]) =>
                  formik.setFieldValue("fl_acl", value)
                }
              />
              {error && <span style={{ color: "red" }}>{error}</span>}
            </Grid>
          </Grid>
        </Collapse>
        <Divider sx={{ m: "10px" }} />
        <Grid container spacing={2} justifyContent="left" alignItems="center">
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          ></Grid>
          <Grid
            item
            xs={1}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <LoadingButton
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Update
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
