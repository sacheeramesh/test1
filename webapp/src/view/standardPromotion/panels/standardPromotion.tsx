// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content. 

import { Box, IconButton, ButtonGroup, Tooltip } from "@mui/material";

import { getInitialData } from "@slices/specialPromotionSlice/specialPromotion";

import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useEffect } from "react";
import { Cached } from "@mui/icons-material";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";
import BackgroundLoader from "@component/common/backgroundLoader";
import SpecialPromotionApplication from "@component/forms/specialPromotionApplication";

export default function PromotionPanel() {
  const dispatch = useAppDispatch();
  const specialPromotion = useAppSelector(
    (state: RootState) => state.specialPromotion
  );
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.userInfo?.email && specialPromotion.state !== "loading") {
      dispatch(getInitialData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundLoader
        open={specialPromotion.backgroundProcess}
        message={specialPromotion.backgroundProcessMessage}
      />
      {specialPromotion.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <ButtonGroup>
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => {
                  dispatch(getInitialData());
                }}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}
      <Box
        className="panel-con"
        sx={{ height: "calc(100vh - 445px)", minHeight: "calc(500px)" }}
      >
        {specialPromotion.state === "loading" && (
          <LoadingEffect message={specialPromotion.stateMessage || ""} />
        )}

        {specialPromotion.state === "success" &&
          (specialPromotion.activePromotionCycle ? (
            <SpecialPromotionApplication />
          ) : (
            <StateWithImage
              imageUrl="/promotion-cycle.svg"
              message="We are not accepting promotion requests right now"
            />
          ))}

        {specialPromotion.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Something went wrong! while loading initial data.!"
          />
        )}
      </Box>
    </>
  );
}
