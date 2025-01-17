import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { RootState, useAppDispatch, useAppSelector } from "@slices/store";
import { insertUser } from "@slices/adminSlices/users";
import { LoadingButton } from "@mui/lab";
import RoleSelector from "./components/roleSelect";
import { Collapse, Divider, Grid, Typography } from "@mui/material";
import { Employee, Role } from "@utils/types";
import FunctionalLeadACLSelector from "@component/forms/components/functionalLeadACLSelector";
import { BUAccessLevel } from "@utils/types";
import EmployeeSelector from "./components/employeeSelector";
import UserImage from "@component/ui/userImage";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("invalid email")
    .required("email is a required field"),
  roles: yup.array(yup.string()).min(1),
});

export default function UserInsertForm() {
  const admin_users = useAppSelector((state: RootState) => state.admin_users);

  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const [url, setURL] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const formik = useFormik<{
    email: string;
    roles: Role[];
    fl_acl: BUAccessLevel[];
  }>({
    initialValues: {
      email: "",
      roles: [],
      fl_acl: [],
    },
    validationSchema: validationSchema,
    validateOnMount: false,
    validateOnChange: false,

    onSubmit: (values) => {
      if (
        values.roles.includes(Role.FUNCTIONAL_LEAD) &&
        values.fl_acl.length === 0
      ) {
        setError("Please configure functional lead access levels");
      } else {
        dispatch(
          insertUser({
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
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {url && name && (
          <Grid container spacing={2} justifyContent="left" alignItems="center">
            <Grid item xs={2}></Grid>
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
                <UserImage
                  email={formik.values.email}
                  size={150}
                  name={formik.values.email}
                  src={url}
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
                marginBottom: "20px",
              }}
            >
              <Typography variant="h5" >
                {name}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2} justifyContent="left" alignItems="center">
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            Lead Email <span style={{ color: "red" }}>*</span>
          </Grid>
          <Grid item xs={6}>
            <EmployeeSelector
              exclude={admin_users.users.map((user) => user.email)}
              setValue={(value: Employee | null) => {
                formik.setFieldValue("email", value?.workEmail);
                setURL(value ? value.employeeThumbnail : null);
                setName(value ? value.firstName + " " + value.lastName : null);
              }}
              isLeadsOnly={true}
            />
            {formik.errors.email && (
              <span style={{ color: "red" }}>{formik.errors.email}</span>
            )}
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
              Add
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
