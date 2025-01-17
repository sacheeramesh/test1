// import React from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as yup from "yup";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useAppDispatch } from "@slices/store";
import { createPromotionCycle } from "@slices/adminSlices/promotionCycle";

import { LoadingButton } from "@mui/lab";
import { useConfirmationModalContext } from "@context/dialogContext";
import { PromotionCycleCreateDialog } from "@config/constant";

const validationSchema = yup.object({
  year: yup.string().required("promotion cycle name is required"),
  h : yup.string().required("promotion cycle name is required"),
  startDate: yup.date().required("Start Date is a Required Field"),
  endDate: yup.date().required("End Date is a Required Field"),
});

export default function NewCycleForm() {
  const dispatch = useAppDispatch();
  const dialogContext = useConfirmationModalContext();

  const formik = useFormik({
    initialValues: {
      name: "",
      year: "",
      h: "",

      startDate: dayjs(),
      endDate: dayjs().add(1, "day"),
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      dialogContext.showConfirmation(
        PromotionCycleCreateDialog.title,
        PromotionCycleCreateDialog.message,
        () => {
          dispatch(
            createPromotionCycle({
              name: values.year +'-'+values.h ,
              startDate: values.startDate.format("YYYY-MM-DD").toString(),
              endDate: values.endDate.format("YYYY-MM-DD").toString(),
            })
          );
        },
        PromotionCycleCreateDialog.okText
      );
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Stack spacing={3} direction={"row"}>
            <FormControl fullWidth>
              <InputLabel id="l1">Year</InputLabel>
              <Select
                labelId="l1"
                id="demo-simple-select"
                fullWidth
                value={formik.values.year}
                label="Year"
                onChange={(e)=> formik.setFieldValue('year', (e.target.value)) }
              >
                <MenuItem value={"2023"}>2023</MenuItem>
                <MenuItem value={"2024"}>2024</MenuItem>
                <MenuItem value={"2025"}>2025</MenuItem>
                <MenuItem value={"2026"}>2026</MenuItem>
                <MenuItem value={"2027"}>2027</MenuItem>
                <MenuItem value={"2028"}>2028</MenuItem>
                <MenuItem value={"2029"}>2029</MenuItem>
                <MenuItem value={"2030"}>2030</MenuItem>
              </Select>
              <FormHelperText
                error={formik.touched.h && Boolean(formik.errors.year)}
              >
                <>
                  {formik.touched.h && Boolean(formik.errors.year)
                    ? "required field"
                    : ""}
                </>
              </FormHelperText>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="l2">Cycle</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-labelas"
              id="l2"
              value={formik.values.h}
              label="H#"
              onChange={(e)=> formik.setFieldValue('h', (e.target.value)) }
            >
              <MenuItem value={"H1"}>H1</MenuItem>
              <MenuItem value={"H2"}>H2</MenuItem>
              </Select>
              <FormHelperText
                error={formik.touched.h && Boolean(formik.errors.h)}
              >
                <>
                  {formik.touched.h && Boolean(formik.errors.h)
                    ? "required field"
                    : ""}
                </>
              </FormHelperText>
              </FormControl>
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl>
              <Stack spacing={3} direction="row">
                <DatePicker
                  label="Start Date"
                  minDate={new Date()}
                  inputFormat="MM/DD/YYYY"
                  value={formik.values.startDate}
                  onChange={(value) => {
                    formik.setFieldValue("startDate", value, true);
                    formik.setFieldValue("endDate", null, true);
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
                <p style={{ fontSize: "36px" }}>&#x27A1;</p>
                <DatePicker
                  label="End Date"
                  minDate={
                    formik.values.startDate && dayjs(formik.values.startDate)
                  }
                  inputFormat="MM/DD/YYYY"
                  value={formik.values.endDate}
                  onChange={(value) =>
                    formik.setFieldValue("endDate", value, true)
                  }
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </Stack>
              <FormHelperText
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              >
                <>
                  {formik.touched.endDate && Boolean(formik.errors.endDate)
                    ? "Invalid Date Range"
                    : " Please select, date range of the promotion cycle  "}
                </>
              </FormHelperText>
            </FormControl>
          </LocalizationProvider>
          <LoadingButton
            color="success"
            variant="contained"
            fullWidth
            type="submit"
            sx={{boxShadow: "none"}}
          >
            Submit
          </LoadingButton>
        </Stack>
      </form>
    </div>
  );
}
