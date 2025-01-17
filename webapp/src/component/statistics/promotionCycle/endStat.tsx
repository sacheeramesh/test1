import { Box, Typography } from "@mui/material";
import React from "react";
import Count from "../count/count";

import { FileCopy } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import TaskIcon from "@mui/icons-material/Task";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { ApplicationState, PromotionRequest } from "@utils/types";
import { getApplicationCountBasedOnState } from "@utils/utils";

function EndStat(props: { loading: boolean; data: PromotionRequest[] | null }) {
  return (
    <Box sx={{ width: "800px" }}>
      {/* application stats */}
      <Box sx={{ ml: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Promotion Board Stats
        </Typography>{" "}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Count
          loading={props.loading}
          icon={<DescriptionIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#0065FF"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.APPROVED,
            ApplicationState.REJECTED,
            ApplicationState.FL_APPROVED,
          ]).toString()}
          title={"Total Requests"}
        />

        <Count
          loading={props.loading}
          icon={<PendingActionsIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#5243AA"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.FL_APPROVED,
          ]).toString()}
          title={"Pending Applications"}
        />
        <Count
          loading={props.loading}
          icon={<TaskIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#00A3BF"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.APPROVED,
          ]).toString()}
          title={"Approved Applications"}
        />
        <Count
          loading={props.loading}
          icon={<FileCopy sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#DE350B"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.REJECTED,
          ]).toString()}
          title={"Rejected Applications"}
        />
      </Box>

      {/* recommendation stats */}
      <Box sx={{ ml: 1, mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Functional Lead Stats
        </Typography>{" "}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Count
          loading={props.loading}
          icon={<DescriptionIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#2684FF"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.SUBMITTED,
            ApplicationState.FL_REJECTED,
            ApplicationState.FL_APPROVED,
            ApplicationState.APPROVED,
            ApplicationState.REJECTED,
          ]).toString()}
          title={"Total Requests"}
        />
        <Count
          loading={props.loading}
          icon={<PendingActionsIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#6554C0"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.SUBMITTED,
          ]).toString()}
          title={"Pending Applications"}
        />
        <Count
          loading={props.loading}
          icon={<TaskIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#008DA6"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.FL_APPROVED,
            ApplicationState.APPROVED,
            ApplicationState.REJECTED,
          ]).toString()}
          title={"Approved Applications"}
        />
        <Count
          loading={props.loading}
          icon={<FileCopy sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#DE350B"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.FL_REJECTED,
          ]).toString()}
          title={"Rejected Applications"}
        />
      </Box>

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
          justifyContent: "space-between",
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
          color="#5243AA"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.DRAFT,
          ]).toString()}
          title={"Pending Applications"}
        />
        <Count
          loading={props.loading}
          icon={<TaskIcon sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#00A3BF"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.SUBMITTED,
            ApplicationState.FL_REJECTED,
            ApplicationState.FL_APPROVED,
            ApplicationState.REJECTED,
            ApplicationState.APPROVED,
          ]).toString()}
          title={"Submitted Applications"}
        />

        <Count
          loading={props.loading}
          icon={<FileCopy sx={{ fontSize: "2rem", mr: "10px" }} />}
          color="#DE350B"
          value={getApplicationCountBasedOnState(props.data, [
            ApplicationState.REMOVED,
          ]).toString()}
          title={"Removed Applications"}
        />
      </Box>
    </Box>
  );
}

export default EndStat;
