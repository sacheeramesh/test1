import React, { useEffect } from "react";
import { Box, ButtonGroup, IconButton, Tooltip } from "@mui/material";

import RecommendationLine from "@component/recommendation/historyLine";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";
import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import { Cached } from "@mui/icons-material";
import { getRecommendationsHistory } from "@slices/leadSlice/recommendationHistory";
import Header from "@component/recommendation/header";

function SubmittedList() {
  const auth = useAppSelector((state: RootState) => state.auth);
  const recommendationHistory = useAppSelector(
    (state: RootState) => state.recommendationHistory
  );

  useEffect(() => {
    if (auth.userInfo?.email && recommendationHistory.state !== "loading") {
      dispatch(getRecommendationsHistory(auth.userInfo?.email));
    }
  }, []);

  const dispatch = useAppDispatch();

  return (
    <>
      {recommendationHistory.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ButtonGroup>
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => {
                  if (auth.userInfo?.email) {
                    dispatch(getRecommendationsHistory(auth.userInfo?.email));
                  }
                }}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}
      {recommendationHistory.state === "success" &&
        recommendationHistory.recommendations.length > 0 && (
          <Header
            headers={[
              {
                title: "Employee Name",
                size: 2,
                align: "left",
              },
              {
                title: "Employee Email",
                size: 2,
                align: "center",
              },
              {
                title: "Promotion Cycle",
                size: 2,
                align: "center",
              },
              {
                title: "State",
                size: 2,
                align: "center",
              },
              {
                title: "Promotion State",
                size: 2,
                align: "center",
              },
              {
                title: "Actions",
                size: 2,
                align: "right",
              },
            ]}
          />
        )}
      <Box
        className="panel-con"
        sx={{ height: "calc(100vh - 445px)", minHeight: "calc(500px)" }}
      >
        {recommendationHistory.state === "loading" && (
          <LoadingEffect message={recommendationHistory.stateMessage || ""} />
        )}

        {recommendationHistory.state === "success" && (
          <>
            {recommendationHistory.recommendations.length === 0 ? (
              <StateWithImage
                imageUrl="/not-found.svg"
                message="There are no submitted requests!"
              />
            ) : (
              recommendationHistory.recommendations?.map(
                (recommendation, i) => {
                  return (
                    <RecommendationLine
                      key={recommendation.recommendationID}
                      recommendation={recommendation}
                      isActiveCycle={
                        recommendation.promotionCycleId !== null
                          ? recommendation.promotionCycleId ==
                            recommendationHistory.activeCycleId
                          : false
                      }
                    />
                  );
                }
              )
            )}
          </>
        )}

        {recommendationHistory.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Unable to load recommendations history."
          />
        )}
      </Box>
    </>
  );
}

export default SubmittedList;
