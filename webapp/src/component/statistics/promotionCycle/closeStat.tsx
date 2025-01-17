import { Box, Typography } from "@mui/material";
import React from "react";
import Count from "../count/count";

import { FileCopy } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import TaskIcon from "@mui/icons-material/Task";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { ApplicationState, PromotionRequest } from "@utils/types";
import { getApplicationCountBasedOnState } from "@utils/utils";

function CloseStat(props: {
  loading: boolean;
  data: PromotionRequest[] | null;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* applicaiton stats */}
      <Box sx={{ ml: 1, mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Stats
        </Typography>{" "}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        <Count
          loading={props.loading}
          icon={<DescriptionIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#0065FF"
          value={props.data ? props.data.length.toString() : "0"}
          title={"Total Requests"}
        />
        <Count
          loading={props.loading}
          icon={<PendingActionsIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#00A3BF"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.SUBMITTED,
            ApplicationState.FL_REJECTED,
            ApplicationState.FL_APPROVED,
            ApplicationState.REJECTED,
            ApplicationState.APPROVED,
          ]).toString()}
          title={"Submitted Requests"}
        />
        <Count
          loading={props.loading}
          icon={<TaskIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#5243AA"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.DRAFT,
          ]).toString()}
          title={"Pending Requests"}
        />
        <Count
          loading={props.loading}
          icon={<FileCopy sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#DE350B"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.REMOVED,
          ]).toString()}
          title={"Removed Requests"}
        />
      </Box>
    </Box>
  );
}

export default CloseStat;
