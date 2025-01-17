// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content. 

import {
  Box,
  Typography,
  IconButton,
  ButtonGroup,
  Tooltip,
} from "@mui/material";

import { useAppDispatch, useAppSelector, RootState } from "@slices/store";

import { useEffect } from "react";
import { Cached, Co2Sharp } from "@mui/icons-material";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";

import Header from "@component/history/application/headerSP";
import RequestLine from "@component/history/application/requestLineSP";
import { getSpecialPromotionRequest } from "@slices/specialPromotionSlice/applicationHistory";

export default function ApplicationHistory() {
  const dispatch = useAppDispatch();

  const requests = useAppSelector(
    (state: RootState) => state.specialPromotionApplicationHistory
  );
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.userInfo?.email && requests.state !== "loading") {
      dispatch(getSpecialPromotionRequest(auth.userInfo?.email));
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
            marginBottom: "10px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ButtonGroup>
            {/* <Search /> */}
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => {
                  if (auth.userInfo?.email) {
                    dispatch(getSpecialPromotionRequest(auth.userInfo?.email));
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
        sx={{ height: "calc(100vh - 445px)", minHeight: "calc(500px)" }}
      >
        {requests.state === "loading" && (
          <LoadingEffect message={requests.stateMessage} />
        )}

        {requests.state === "success" &&
          requests.requests &&
          requests.requests.length > 0 &&
          requests.requests
            .filter(
              (request) =>
                request.promotionType === "INDIVIDUAL_CONTRIBUTOR" &&
                request.createdBy === auth.userInfo?.email
            )
            .map((request) => {
              return (
                <RequestLine
                  key={request.id}
                  request={request}
                  isActiveCycle={
                    requests.activeCycleId !== null
                      ? requests.activeCycleId == request.promotionCycle
                      : false
                  }
                />
              );
            })}

        {requests.state === "success" && requests.requests?.length === 0 && (
          <StateWithImage
            imageUrl="/not-found.svg"
            message="There are no promotion requests"
          />
        )}

        {requests.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Unable to load Individual Contributor Promotions history"
          />
        )}
      </Box>
    </>
  );
}
