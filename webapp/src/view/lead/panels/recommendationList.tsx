import { useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  ButtonGroup,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";

import StateWithImage from "@component/ui/stateWithImage";
import { LoadingEffect } from "@component/ui/loading";
import RecommendationLine from "@component/recommendation/recommendationLine";
import Recommendation from "@component/recommendation/recommendation";

import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import { getAllRecommendationsWithActivePromoCycle } from "@slices/leadSlice";
import { Cached } from "@mui/icons-material";

import Header from "@component/recommendation/header";
import BackgroundLoader from "@component/common/backgroundLoader";
import { setCurrentEdit } from "@slices/leadSlice";

function RecommendationList() {
  const auth = useAppSelector((state: RootState) => state.auth);
  const lead = useAppSelector((state: RootState) => state.lead);

  useEffect(() => {
    if (
      auth.userInfo?.email &&
      lead.currentEditObject == null &&
      lead.state !== "loading"
    ) {
      dispatch(getAllRecommendationsWithActivePromoCycle(auth.userInfo?.email));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.currentEditObject]);

  const dispatch = useAppDispatch();

  return (
    <>
      <BackgroundLoader
        open={lead.backgroundProcess}
        message={lead.backgroundProcessMessage}
      />
      {lead.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <ButtonGroup>
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => {
                  if (auth.userInfo?.email) {
                    dispatch(
                      getAllRecommendationsWithActivePromoCycle(
                        auth.userInfo?.email
                      )
                    );
                  }
                }}
              >
                <Cached />
              </IconButton>
            </Tooltip>
            {lead.currentEditObject && (
              <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 1, mt: "5px" }}>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => dispatch(setCurrentEdit(null))}
                >
                  <Typography sx={{ color: "#FF7300" }}>
                    Promotion Submission Request
                  </Typography>
                </Link>
                <Typography sx={{ color: "#gray" }}>Application</Typography>
              </Breadcrumbs>
            )}
          </ButtonGroup>
        </Box>
      )}
      {lead.state === "success" &&
        !lead.currentEditObject &&
        lead.recommendations.length > 0 && (
          <Header
            headers={[
              {
                title: "Employee Name",
                size: 4,
                align: "left",
              },
              {
                title: "Promotion Cycle",
                size: 2,
                align: "left",
              },
              {
                title: "Employee Email",
                size: 4,
                align: "left",
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
        {lead.state === "loading" && (
          <LoadingEffect message={lead.stateMessage || ""} />
        )}

        {lead.state === "success" && lead.recommendations.length === 0 && (
          <StateWithImage
            imageUrl="/not-found.svg"
            message="There are no pending promotion requests."
          />
        )}

        {lead.state === "success" && (
          <>
            {lead.currentEditObject && <Recommendation />}

            {!lead.currentEditObject &&
              lead.recommendations.length > 0 &&
              lead.recommendations?.map((recommendation, i) => {
                return (
                  <RecommendationLine
                    key={recommendation.recommendationID}
                    recommendation={recommendation}
                  />
                );
              })}
          </>
        )}

        {lead.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Unable to load recommendation requests."
          />
        )}
      </Box>
    </>
  );
}

export default RecommendationList;
