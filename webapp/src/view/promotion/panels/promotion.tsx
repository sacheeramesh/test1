import React from "react";

import {
  Box,
  Typography,
  IconButton,
  ButtonGroup,
  Breadcrumbs,
  Tooltip,
} from "@mui/material";

import { checkInitialData } from "@slices/promotionSlice/promotion";

import { useAppDispatch, useAppSelector, RootState } from "@slices/store";

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Cached } from "@mui/icons-material";
import { LoadingEffect } from "@component/ui/loading";
import StateWithImage from "@component/ui/stateWithImage";

import PromotionSubView from "./promotionSubView";
import Application from "./applicationSubView";
import BackgroundLoader from "@component/common/backgroundLoader";
import { Dispatch } from "redux";

export default function PromotionPanel() {
  const dispatch = useAppDispatch();
  const promotion = useAppSelector((state: RootState) => state.promotion);
  const auth = useAppSelector((state: RootState) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (auth.userInfo?.email && promotion.state !== "loading") {
      dispatch(
        checkInitialData(auth.userInfo?.email ? auth.userInfo?.email : "")
      );
    }
  }, []);

  useEffect(() => {
    const subViews = ["home", "application"];

    const currentSubView = searchParams.get("subView");
    if (currentSubView && subViews.indexOf(currentSubView) !== -1) {
      setValue(subViews.indexOf(currentSubView));
    } else {
      searchParams.set("subView", subViews[0]);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <BackgroundLoader
        open={promotion.backgroundProcess}
        message={promotion.backgroundProcessMessage}
      />
      {promotion.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <ButtonGroup>
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => {
                  dispatch(
                    checkInitialData(
                      auth.userInfo?.email ? auth.userInfo?.email : ""
                    )
                  );
                }}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
          {value === 1 ? (
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                ml: 1,
              }}
            >
              <Link
                color="inherit"
                onClick={() => {
                  searchParams.set("subView", "home");
                  setSearchParams(searchParams);
                }}
                to={""}
              >
                <Typography sx={{ color: "#FF7300" }}>Home</Typography>
              </Link>
              <Typography sx={{ color: "#gray" }}>
                Promotion Application
              </Typography>
            </Breadcrumbs>
          ) : (
            <Typography variant="h5">{""}</Typography>
          )}
        </Box>
      )}
      <Box
        className="panel-con"
        sx={{ height: "calc(100vh - 445px)", minHeight: "calc(500px)" }}
      >
        {promotion.state === "loading" && (
          <LoadingEffect message={promotion.stateMessage || ""} />
        )}

        {promotion.state === "success" && value === 0 && <PromotionSubView />}
        {promotion.state === "success" && value === 1 && <Application />}

        {promotion.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Unable to load promotion view."
          />
        )}
      </Box>
    </>
  );
}
