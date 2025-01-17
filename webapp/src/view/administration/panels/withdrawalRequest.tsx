import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useEffect } from "react";

import { LoadingEffect } from "@component/ui/loading";
import WithdrawalRequestLine from "@component/promotion/withdrawalRequestLine";
import {
  Box,
  ButtonGroup,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import StateWithImage from "@component/ui/stateWithImage";

import {
  ApplicationState,
  getAllWithdrawalRequest,
} from "@slices/adminSlices/withdrawalRequests";
import { Cached } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";
import Header from "@component/recommendation/header";

export default function WithdrawalRequest() {
  //redux dispatch / states
  const dispatch = useAppDispatch();
  const withdrawalRequestsState = useAppSelector(
    (state: RootState) => state.admin_withdrawal_requests
  );

  useEffect(() => {
    if (withdrawalRequestsState.state !== 'loading') {
      dispatch(getAllWithdrawalRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundLoader
        open={withdrawalRequestsState.backgroundProcess}
        message={withdrawalRequestsState.backgroundProcessMessage}
      />
      {withdrawalRequestsState.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            padding: "0px 10px",
            display: "flex",
            marginBottom: "4rem",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <ButtonGroup>
              <Tooltip title={"Refresh Page"}>
                <IconButton
                  size="small"
                  onClick={() => dispatch(getAllWithdrawalRequest())}
                >
                  <Cached />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
            {withdrawalRequestsState.withdrawalRequests &&
              withdrawalRequestsState.withdrawalRequests?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    ml: "50px",
                    alignItems: "center",
                    width: "fit-content",

                    borderRadius: 1,
                    bgcolor: "background.paper",
                    color: "text.secondary",
                    "& svg": {
                      m: 1.5,
                    },
                    "& hr": {
                      mx: 0.5,
                    },
                  }}
                >
                  <Typography
                    variant={"h5"}
                    sx={{ margin: "0px 20px", color: "#344563" }}
                  >
                    All Count :{" "}
                    {withdrawalRequestsState.withdrawalRequests?.length}
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography
                    variant={"h5"}
                    sx={{ margin: "0px 20px", color: "#36B37E" }}
                  >
                    Withdrawal Count :{" "}
                    {
                      withdrawalRequestsState.withdrawalRequests?.filter(
                        (req) => req.status === ApplicationState.WITHDRAW
                      ).length
                    }
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography
                    variant={"h5"}
                    sx={{ margin: "0px 20px", color: "#BF2600" }}
                  >
                    Approved Withdrawal Count :{" "}
                    {
                      withdrawalRequestsState.withdrawalRequests?.filter(
                        (req) => req.status === ApplicationState.REMOVED
                      ).length
                    }
                  </Typography>
                </Box>
              )}
          </Stack>
        </Box>
      )}

      {withdrawalRequestsState.state === "success" &&
        withdrawalRequestsState.withdrawalRequests &&
        withdrawalRequestsState.withdrawalRequests.length > 0 && (
          <Header
            headers={[
              {
                title: "Employee Email",
                size: 3,
                align: "left",
              },
              {
                title: "Promotion Cycle",
                size: 2,
                align: "center",
              },
              {
                title: "Promotion Cycle",
                size: 2,
                align: "center",
              },

              {
                title: "Actions",
                size: 5,
                align: "right",
              },
            ]}
          />
        )}

      <Box
        className="panel-con"
        sx={{ height: "calc(100vh - 445px)", minHeight: "calc(500px)" }}
      >
        {withdrawalRequestsState.state === "loading" && (
          <LoadingEffect message={withdrawalRequestsState.stateMessage} />
        )}
        {withdrawalRequestsState.state === "success" &&
          withdrawalRequestsState.withdrawalRequests &&
          withdrawalRequestsState.withdrawalRequests.length > 0 &&
          // eslint-disable-next-line array-callback-return
          withdrawalRequestsState.withdrawalRequests.map((request) => {
            return <WithdrawalRequestLine key={request.id} request={request} />;
          })}
        {withdrawalRequestsState.state === "success" &&
          withdrawalRequestsState.withdrawalRequests?.length === 0 && (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There are no pending withdrawal requests"
            />
          )}

        {withdrawalRequestsState.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Unable to load withdrawal requests!"
          />
        )}
      </Box>
    </>
  );
}
