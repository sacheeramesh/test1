import { Grid } from "@mui/material";
import RecommendationFrom from "@component/forms/recommendationForm";

export default function Recommendation() {
  
  return (
    <>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <RecommendationFrom />
      </Grid>
    </>
  );
}
