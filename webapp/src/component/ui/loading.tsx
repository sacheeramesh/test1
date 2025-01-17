import React from "react";
import { CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";

export const LoadingEffect = (props: { message: string | null; isCircularLoading?: boolean }) => {

  return (
    <>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "150px",
        }}
      >
        {props.isCircularLoading ? <CircularProgress /> : <LinearProgress sx={{width:"70px"}}/>}
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "30px",
        }}
      >
        <Typography variant="h5">{props.message}</Typography>
      </Grid>
    </>
  );
};
