import React, { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

function Count(props: {
  icon: ReactElement;
  color: string;
  value: string;
  title: string;
  loading?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
        padding: "1rem",
        margin: "0.4rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          color: props.color,
        }}
      >
        {props.loading ? (
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            sx={{ mr: "10px" }}
          />
        ) : (
          props.icon
        )}
        {props.loading ? (
          <Skeleton variant="rectangular" width={100} height={44.5} />
        ) : (
          <Typography
            variant="h6"
            sx={{ width: "100px", fontWeight: "600", color: props.color }}
          >
            {props.title}
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: "10px" }}>
        {props.loading ? (
          <Skeleton variant="rectangular" width={150} height={53.3} />
        ) : (
          <Typography variant="h2" sx={{ color: props.color }}>
            {props.value}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Count;
