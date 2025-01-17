import React from "react";
import Grid from "@mui/material/Grid";
import { Box, Container, Card, CardContent, Typography } from "@mui/material";

interface ErrorHandlerProps {
  message: string | null;
}

const ErrorHandler = (props: ErrorHandlerProps) => {
  return (
    <Box
      sx={{
        background: "#E7EBF0",
        display: "flex",
        pt:"20vh",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ borderRadius: "0px", p: 10 }} variant="outlined">
          <CardContent>
            <Box>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12}>
                  <img
                    alt="logo"
                    width="150"
                    height="auto"
                    src="/warning.svg"
                  ></img>
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}><Typography variant="h4">{props.message}</Typography></Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>

                {/* TODO : write refresh function */}
                {/* <IconButton aria-label="refresh" size="large">
                  <CachedIcon fontSize="inherit" />
                </IconButton> */}
                </Grid>
              </Grid>
              
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ErrorHandler;
