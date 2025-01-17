import { CircularProgress, Grid, Typography } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";

export const activePromotionBanner = (
  name: string,
  startDate: Date,
  endDate: Date
) => {
  return (
    <>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h4" fontWeight={500} marginTop="30px">
          Promotion Application for {name} is now open
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "center" }}
        marginTop="20px"
      >
        <Typography variant="h4" fontWeight={300} marginBottom="20px">
          <>Promotion cycle ends on {endDate}</>
        </Typography>
      </Grid>
    </>
  );
};

export const topNav = () => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    ></Grid>
  );
};

export const button = (text: string, onclick: () => void, loading: boolean) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <LoadingButton
        size="large"
        loading={loading}
        onClick={onclick}
        variant="contained"
        color="success"
      >
        {text}
      </LoadingButton>
    </Grid>
  );
};

export const loadingEffect = () => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "150px",
      }}
    >
      <CircularProgress />
    </Grid>
  );
};

export const noActivePromotionCycle = () => {
  return (
    <Grid
      item
      xs={12}
      style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
    >
      <Typography variant="h4">
        We are <b>not</b> accepting promotion applications right now
      </Typography>
    </Grid>
  );
};

export const userNotEligible = () => {
  return (
    <>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        <ReportProblemIcon sx={{ color: "#FF7300", fontSize: "50px" }} />
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">
          Sorry, you are not eligible for a promotion as you do not meet the
          promotion criteria
        </Typography>
      </Grid>
    </>
  );
};

export const messageSection = (message: string) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" fontWeight={500}>
        {message}
      </Typography>
    </Grid>
  );
};

export const userWithdrawalRequested = () => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" fontWeight={500}>
        You have requested withdrawal for this promotion application
        <br />
      </Typography>
    </Grid>
  );
};
