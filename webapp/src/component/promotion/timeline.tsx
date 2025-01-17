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

import { useEffect } from "react";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";
import { APIService } from "@utils/apiService";
import { ApplicationState, EmployeeInfo, PromotionRequest } from "@utils/types";
import { AppConfig } from "@config/config";
import { PromotionType } from "@slices/promotionSlice/promotionHistory";

export default function PromotionTimeline(props: {
  employeeEmail: string;
  hideStatusImage?: boolean;
}) {
  const [state, setState] = React.useState<
    "idle" | "loading" | "success" | "failed"
  >("loading");
  const [requests, setRequests] = React.useState<PromotionRequest[]>([]);
  const [history, setHistory] = React.useState<EmployeeInfo>();

  useEffect(() => {
    setState("loading");
    Promise.all([
      APIService.getInstance().get<{ employeeInfo: EmployeeInfo }>(
        AppConfig.serviceUrls.getEmployeeHistory +
          "?employeeWorkEmail=" +
          props.employeeEmail
      ),
      APIService.getInstance().get<{ promotionRequests: PromotionRequest[] }>(
        AppConfig.serviceUrls.retrieveAllPromotionRequests +
          "?statusArray=APPROVED&employeeEmail=" +
          props.employeeEmail
      ),
    ])
      .then(([history, promotionHistory]) => {
        setRequests(promotionHistory.data.promotionRequests);
        setHistory(history.data.employeeInfo);
        setState("success");
      })
      .catch((error: Error) => {
        setState("failed");
      });
  }, [props.employeeEmail]);

  return (
    <>
      {/* If Employee history is loading */}
      {state === "loading" && (
        <LoadingEffect message={"Loading Employee History"} />
      )}

      {state === "success" && requests && (
        <>
          <Timeline position="alternate">
            {requests.length > 0 && (
              <>
                {requests.map((request) => {
                  return (
                    request.status !== ApplicationState.PROCESSING && (
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
                                Promoted to JB: {request.nextJobBand}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" component="span">
                              Promoted to JB: {request.nextJobBand}
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
                    )
                  );
                })}
              </>
            )}

            {/* Initial Timeline Item */}
            {history && (
              <TimelineItem key="initialItem">
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  variant="body2"
                  color="text.secondary"
                >
                  {history.startDate}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                  <TimelineDot color="inherit" sx={{ boxShadow: 4 }}>
                    <BadgeIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <Typography variant="h6" component="span">
                    Joined in JB:{" "}
                    {requests[requests.length - 1]?.currentJobBand}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    BU: {history.joinedBusinessUnit} <br />
                    Dept: {history.joinedDepartment} <br />
                    Team: {history.joinedTeam} <br />
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )}
          </Timeline>
        </>
      )}

      {state === "failed" && (
        <StateWithImage
          imageUrl="/warning.svg"
          message="Unable to load promotion history."
        />
      )}
    </>
  );
}
