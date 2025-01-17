import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box, Container, LinearProgress } from "@mui/material";

interface PreLoaderProps {
  message: string | null;
  hideLogo?: boolean;
  isLoading?: boolean;
}

const PreLoader = (props: PreLoaderProps) => {
  return (
    <Box
      sx={{
        background: "#E7EBF0",
        display: "flex",
        pt: "20vh",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Box>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              {!props.hideLogo && (
                <img
                  alt="logo"
                  width="250"
                  height="auto"
                  src="/pre_load.svg"
                ></img>
              )}
            </Grid>
            <Grid item xs={12}></Grid>

            <Grid item xs={12}>
              <Typography variant="h4">
                {props.message || "Promotion App"}
              </Typography>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              {props.isLoading && <LinearProgress sx={{ width: "100px" }} />}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PreLoader;
