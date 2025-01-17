import { Box, Grid, Typography } from "@mui/material";

import { Header } from "@utils/types";

function SimpleHeader(props: { headers: Header[] }) {
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",

          margin: "0 12px",
          borderBottom: "1px dashed #e3e3e3",
          p: "5px 20px",
          marginBottom: "5px",
        }}
      >
        <Grid container spacing={2}>
          {props.headers.map((header, index) => {
            return (
              <Grid
                key={index}
                item
                xs={header.size}
                style={{
                  display: "flex",
                  justifyContent: header.align,
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  <b>{header.title}</b>
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
}

export default SimpleHeader;
