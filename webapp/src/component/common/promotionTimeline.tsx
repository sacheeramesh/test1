import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";

import BadgeIcon from "@mui/icons-material/Badge";
import Typography from "@mui/material/Typography";
import StarsIcon from "@mui/icons-material/Stars";
import Chip from "@mui/material/Chip";

import {
  getAllPromotion,
  PromotionType,
} from "@slices/promotionSlice/promotionHistory";

import { EmployeeHistory } from "@slices/commonSlice/employeeHistory";
import { RootState, useAppDispatch, useAppSelector } from "@slices/store";
import { useEffect } from "react";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";

export default function CustomizedTimeline(props: {
  employeeEmail: string;
  empHistory: EmployeeHistory;
}) {
  const dispatch = useAppDispatch();
  const promotions = useAppSelector(
    (state: RootState) => state.promotionHistory
  );

  useEffect(() => {
    if (props.employeeEmail) {
      dispatch(getAllPromotion(props.employeeEmail));
    }
  }, []);

  return (
    <>
      {/* If Employee history is loading*/}
      {promotions.state === "loading" && (
        <LoadingEffect message={promotions.stateMessage} />
      )}

      {promotions.state === "success" && promotions.requests && (
        <>
          {promotions.requests.length > 0 ? (
            <>
              <Timeline position="alternate">
                {promotions.requests.map((request) => {
                  return (
                    <TimelineItem key={request.id}>
                      <TimelineOppositeContent
                        sx={{ m: "auto 0" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {request.promotionCycle}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        {request.promotionType === PromotionType.SPECIAL ? (
                          <TimelineDot color="secondary">
                            <StarsIcon />
                          </TimelineDot>
                        ) : (
                          <TimelineDot color="primary">
                            <StarsIcon />
                          </TimelineDot>
                        )}

                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        {request.promotionType === PromotionType.SPECIAL ? (
                          <>
                            <Chip
                              key={request.id}
                              label="Special"
                              variant="outlined"
                              color="secondary"
                              size="small"
                            />
                            <br />
                            <Typography variant="h6" component="span">
                              Promoted to JB:{request.nextJobBand}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="h6" component="span">
                            Promoted to JB:{request.nextJobBand}
                          </Typography>
                        )}
                        <br />
                        <Typography variant="caption">
                          BU: {request.businessUnit} <br />
                          Dept: {request.department} <br />
                          Team: {request.team}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}

                <TimelineItem key="initialItem">
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {props.empHistory.startDate}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                    <TimelineDot color="secondary">
                      <BadgeIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography variant="h6" component="span">
                      Joined in JB :
                      {
                        promotions.requests[promotions.requests.length - 1]
                          .currentJobBand
                      }
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      BU: {props.empHistory.joinedBusinessUnit} <br />
                      Dept: {props.empHistory.joinedDepartment} <br />
                      Team: {props.empHistory.joinedTeam} <br />
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </>
          ) : (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There is no promotion history"
            />
          )}
        </>
      )}
    </>
  );
}
