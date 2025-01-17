import React from "react";

import { Grid } from "@mui/material";

function HeaderWithImage(props: { image: string }) {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
        height: "400px",
      }}
    >
      <img
        height={"100%"}
        src={props.image}
        alt="Promotion Images"
        className="image"
      />
    </Grid>
  );
}

export default HeaderWithImage;
