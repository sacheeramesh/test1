import React from "react";
import { Grid, Typography } from "@mui/material";

function StateWithImage(props: {
  message: string;
  imageUrl: string;
  hideImage?: boolean;
}) {
  return (
    <>
      {!props.hideImage && (
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
            height: "180px",
          }}
        >
          <img
            height={"100%"}
            src={props.imageUrl}
            alt="Promotion Images"
            className="image"
          />
        </Grid>
      )}
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: props.hideImage ? 100 : 30,
        }}
      >
        <Typography variant="h5">{props.message}</Typography>
      </Grid>
    </>
  );
}

export default StateWithImage;
