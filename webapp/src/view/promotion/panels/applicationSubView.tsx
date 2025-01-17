// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Grid, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useAppSelector, RootState } from "@slices/store";
import { ApplicationState } from "@slices/promotionSlice/promotion";

import ApplicationForm from "@component/forms/applicationForm";
import BackgroundLoader from "@component/common/backgroundLoader";

import { Link, useSearchParams } from "react-router-dom";
import StateWithImage from "@component/ui/stateWithImage";

function Application() {
  const [searchParams, setSearchParams] = useSearchParams();
  const promotion = useAppSelector((state: RootState) => state.promotion);

  return (
    <>
      <BackgroundLoader
        open={promotion.backgroundProcess}
        message={promotion.backgroundProcessMessage}
      />
      {promotion.state === "success" && (
        <Grid container spacing={3}>
          {!promotion.activePromotionCycle ? (
            <Grid item xs={12}>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "50px",
                }}
              >
                <img src="/warning.svg" alt="Details" className="image" />
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Typography variant="h4">
                  There is no active promotion cycle to apply or application to
                  fill
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  color="primary"
                  component="label"
                  onClick={() => {
                    searchParams.set("subView", "home");
                    setSearchParams(searchParams);
                  }}
                >
                  <ArrowBackIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
          ) : (
            <>
              {!promotion.activePromotionCycle.request && (
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px",
                  }}
                >
                  Application not found.
                </Grid>
              )}

              {/* Application in DRAFT state */}
              {promotion.activePromotionCycle.request?.promotionType ===
                "NORMAL" &&
                (promotion.activePromotionCycle.request?.status ===
                  ApplicationState.DRAFT ||
                  promotion.activePromotionCycle.request?.status ===
                    ApplicationState.SUBMITTED) && (
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "0px 20px",
                      marginTop: "20px",
                    }}
                  >
                    <ApplicationForm
                      state={promotion.activePromotionCycle.request?.status}
                    />
                  </Grid>
                )}

              {promotion.activePromotionCycle.request?.promotionType ===
                "SPECIAL" && (
                <StateWithImage
                  imageUrl="/warning.svg"
                  message="You have already applied for a Individual Contributor Promotion. You cannot apply for a normal promotion until the Individual Contributor Promotion is approved or rejected."
                />
              )}
            </>
          )}
        </Grid>
      )}
    </>
  );
}

export default Application;
