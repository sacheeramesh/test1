import { ArrowDownward } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";

function PromotionBoardRequestHeader() {
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",

          margin: "0 12px",
          p: "10px 20px",
          marginBottom: "3px",
          // marginBottom: "10px",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Typography variant="h5"> Promotion Cycle</Typography>
           
          </Grid>
          
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">  Employee Email</Typography>
           
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Status</Typography>
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Recommended To</Typography>
          </Grid>
         
         
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
           
              <Typography variant="h5">Actions</Typography>
          
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default PromotionBoardRequestHeader;
