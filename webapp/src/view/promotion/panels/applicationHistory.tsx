import React from "react";

import { Box, Typography, IconButton, ButtonGroup, Tooltip } from "@mui/material";

import { getAllPromotionRequest } from "@slices/promotionSlice/applicationHistory";

import { useAppDispatch, useAppSelector, RootState } from "@slices/store";

import { useEffect } from "react";
import { Cached } from "@mui/icons-material";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";

import Header from '@component/history/application/header'
import RequestLine from "@component/history/application/requestLine";
import { UIMessages } from "@config/constant";

export default function ApplicationHistory() {
  const dispatch = useAppDispatch();

  const requests = useAppSelector(
    (state: RootState) => state.applicationHistory
  );
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.userInfo?.email && requests.state !== 'loading' ) {
      dispatch(getAllPromotionRequest(auth.userInfo?.email));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {requests.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            marginBottom: "0px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Typography variant={"h5"}> Applications History</Typography> */}
          <ButtonGroup>
            {/* <Search /> */}
            <Tooltip title={"Refresh Page"}>
            <IconButton
              size="small"
              onClick={() => {
                if (auth.userInfo?.email) {
                  dispatch(getAllPromotionRequest(auth.userInfo?.email));
                }
              }}
            >
              <Cached />
              </IconButton>
              </Tooltip>
          </ButtonGroup>
        </Box>
      )}

      {requests.state === "success" &&
        requests.requests &&
        requests.requests.length > 0 && <Header />}

      <Box
        className="panel-con"
        sx={{ height: "calc(100vh - 495px)", minHeight: "calc(500px)" }}
      >
        {requests.state === "loading" && (
          <LoadingEffect message={requests.stateMessage} />
        )}

        {requests.state === "success" &&
          requests.requests &&
          requests.requests.length > 0 && 
          requests.requests.map((request) => {
            return (
              <RequestLine  key={request.id} request={request} isActiveCycle={ requests.activeCycleId !== null ? requests.activeCycleId === request.promotionCycle: false} />
            )
          })
        }
        

        {requests.state === "success" && requests.requests?.length === 0 && (
          <StateWithImage
            imageUrl="/not-found.svg"
            message= {UIMessages.emptyRecords.applicationHistory}
          />
        )}
      </Box>
    </>
  );
}
