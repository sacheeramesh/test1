import {
  Grid,
  IconButton,
  Typography,
  Collapse,
  Paper,
  Fade,
  CircularProgress,
  ButtonGroup,
  Box,
  Tooltip,
  Breadcrumbs,
} from "@mui/material";
import {
  AddCircleOutline,
  Cached,
  Close,
  CloseOutlined,
  NotificationImportant,
} from "@mui/icons-material";

import {
  getActivePromotionCycle,
  getAllPromotionRequests,
  endPromotionCycle,
  closePromotionCycle,
} from "@slices/adminSlices/promotionCycle";

import {
  PromotionApplicationCycleCloseDialog,
  PromotionCycleEndDialog,
} from "@config/constant";

import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import NewCycleForm from "@component/forms/promotionCycleForm";
import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import { Stack } from "@mui/system";
import Skeleton from "@mui/material/Skeleton";

import { useConfirmationModalContext } from "@context/dialogContext";
import CloseStat from "@component/statistics/promotionCycle/closeStat";
import EndStat from "@component/statistics/promotionCycle/endStat";
import NotificationHub from "./notificationHub";
import { Link, useSearchParams } from "react-router-dom";
import { LoadingEffect } from "@component/ui/loading";

export default function PromotionCycle() {
  const admin_manage_promotion_cycle = useAppSelector(
    (state: RootState) => state.admin_manage_promotion_cycle
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<number>(0);

  const tabs = ["home", "notifications-hub"];

  useEffect(() => {
    const currentSubView = searchParams.get("subView");

    if (currentSubView && tabs.indexOf(currentSubView) !== -1) {
      setValue(tabs.indexOf(currentSubView));
    } else {
      searchParams.set("subView", tabs[0]);
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (
      admin_manage_promotion_cycle.state !== "loading"
    ) {
      dispatch(getActivePromotionCycle());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loading stat
  useEffect(() => {
    if (
      admin_manage_promotion_cycle.state !== "loading" &&
      admin_manage_promotion_cycle.activePromotionCycle
    ) {
      dispatch(
        getAllPromotionRequests(
          admin_manage_promotion_cycle.activePromotionCycle.id
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin_manage_promotion_cycle.state]);

  const dispatch = useAppDispatch();

  const dialogContext = useConfirmationModalContext();

  const [check, setCheck] = useState<boolean>(false);
  return (
    <>
      {admin_manage_promotion_cycle.state !== "loading" && (
        <Box
          className="panel-con"
          sx={{
            height: "36px",
            marginBottom: "20px",
            padding: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
            flexDirections: "row",
          }}
        >
          <ButtonGroup>
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => dispatch(getActivePromotionCycle())}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          {value === 1 && (
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
              <Typography sx={{ color: "#gray" }}>Notification Hub</Typography>
            </Breadcrumbs>
          )}
        </Box>
      )}

      <Box
        className="panel-con"
        sx={{
          height: "calc(100vh - 445px)",
          minHeight: "calc(500px)",
        }}
      >
        {/* manage promotion cycle */}
        {admin_manage_promotion_cycle.state === "loading" && (
          <LoadingEffect message={admin_manage_promotion_cycle.stateMessage} />
        )}

        {/* sub view  0*/}
        {value === 0 && admin_manage_promotion_cycle.state !== "loading" && (
          <Box
            className="panel-con"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {/* manage promotion cycle */}
            <Box
              className="panel-con"
              sx={{
                height: "calc(100vh - 445px)",
                minHeight: "calc(500px)",
                width: "800px",
              }}
            >
              {admin_manage_promotion_cycle.activePromotionCycle && (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "30px",
                      height: "150px",
                    }}
                  >
                    <img
                      height={"100%"}
                      src="/promotion-cycle.svg"
                      alt="Promotion Images"
                      className="image"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Typography variant="h4" fontWeight={500}>
                      {admin_manage_promotion_cycle.activePromotionCycle.name}{" "}
                      Promotion Cycle is{" "}
                      {admin_manage_promotion_cycle.activePromotionCycle
                        .status === "OPEN"
                        ? "Open"
                        : "Closed"}
                    </Typography>
                  </Grid>

                  {admin_manage_promotion_cycle.activePromotionCycle.status ===
                    "OPEN" && (
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Typography variant="h5" fontWeight={300}>
                        <>
                          {
                            admin_manage_promotion_cycle.activePromotionCycle
                              .startDate
                          }{" "}
                          to{" "}
                          {
                            admin_manage_promotion_cycle.activePromotionCycle
                              .endDate
                          }
                        </>
                      </Typography>
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    {admin_manage_promotion_cycle.activePromotionCycle
                      .status === "OPEN" ? (
                      <LoadingButton
                        variant="contained"
                        sx={{ boxShadow: "none" }}
                        startIcon={<CloseOutlined />}
                        color="warning"
                        size="large"
                        onClick={() => {
                          dialogContext.showConfirmation(
                            PromotionApplicationCycleCloseDialog.title,
                            PromotionApplicationCycleCloseDialog.message,
                            () => {
                              if (
                                admin_manage_promotion_cycle.activePromotionCycle
                              ) {
                                dispatch(
                                  closePromotionCycle(
                                    admin_manage_promotion_cycle
                                      .activePromotionCycle.id
                                  )
                                );
                              }
                            },
                            PromotionApplicationCycleCloseDialog.okText
                          );
                        }}
                      >
                        Close Application
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        variant="contained"
                        sx={{ boxShadow: "none" }}
                        startIcon={<CloseOutlined />}
                        color="error"
                        size="large"
                        onClick={() => {
                          dialogContext.showConfirmation(
                            PromotionCycleEndDialog.title,
                            PromotionCycleEndDialog.message,
                            () => {
                              if (
                                admin_manage_promotion_cycle.activePromotionCycle
                              ) {
                                dispatch(
                                  endPromotionCycle(
                                    admin_manage_promotion_cycle
                                      .activePromotionCycle.id
                                  )
                                );
                              }
                            },
                            PromotionCycleEndDialog.okText
                          );
                        }}
                      >
                        End Promotion Cycle
                      </LoadingButton>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Stack spacing={3}></Stack>
                  </Grid>
                </>
              )}
              {!admin_manage_promotion_cycle.activePromotionCycle && (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "30px",
                      height: "100px",
                    }}
                  >
                    <img
                      height={"100%"}
                      src="/not-found.svg"
                      alt="Promotion Images"
                      className="image"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Typography variant="h4">
                      Active promotion cycle not found
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Collapse in={check}>
                      <Paper
                        square
                        className="paper"
                        variant="outlined"
                        sx={{
                          minHeight: "calc(350px)",
                          
                          width: "600px",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "20px",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "left",
                            }}
                          >
                            <Typography
                              variant="h3"
                              sx={{ marginTop: "8px", marginLeft: "10px" }}
                            >
                              Creating Promotion Cycle
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="primary"
                              onClick={() => setCheck(!check)}
                            >
                              <Close sx={{ fontSize: "36px" }} />
                            </IconButton>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "20px",
                          }}
                        >
                          <NewCycleForm />
                        </Grid>
                      </Paper>
                    </Collapse>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Fade in={!check}>
                      <LoadingButton
                        variant="contained"
                        startIcon={<AddCircleOutline />}
                        color="success"
                        size="large"
                        onClick={() => setCheck(!check)}
                      >
                        Create
                      </LoadingButton>
                    </Fade>
                  </Grid>
                </>
              )}
            </Box>

            {/* promotion cycle statistics */}
            {admin_manage_promotion_cycle.state === "success" &&
              admin_manage_promotion_cycle.activePromotionCycle && (
                <Box
                  className="panel-con"
                  sx={{
                    height: "calc(100vh - 445px)",
                    minHeight: "calc(500px)",
                  }}
                >
                  {admin_manage_promotion_cycle.activePromotionCycle.status ===
                  "OPEN" ? (
                    <CloseStat
                      data={admin_manage_promotion_cycle.promotionRequests}
                      loading={
                        admin_manage_promotion_cycle.stat_state === "loading"
                      }
                    />
                  ) : (
                    <>
                      <Box sx={{ ml: 1, mb: 2 }}>
                        <Box sx={{ ml: 1, mb: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Options
                          </Typography>{" "}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          {admin_manage_promotion_cycle.stat_state ===
                          "loading" ? (
                            <Skeleton
                              variant="rectangular"
                              width={185}
                              height={40}
                              sx={{ mr: "10px" }}
                            />
                          ) : (
                            <LoadingButton
                              sx={{ boxShadow: "none" }}
                              variant="contained"
                              startIcon={<NotificationImportant />}
                              color="info"
                              size="large"
                              onClick={() => {
                                searchParams.set(
                                  "subView",
                                  "notifications-hub"
                                );
                                setSearchParams(searchParams);
                              }}
                            >
                              Notification Hub
                            </LoadingButton>
                          )}
                        </Box>
                      </Box>
                      <EndStat
                        data={admin_manage_promotion_cycle.promotionRequests}
                        loading={
                          admin_manage_promotion_cycle.stat_state === "loading"
                        }
                      />
                    </>
                  )}
                </Box>
              )}
          </Box>
        )}

        {/* sub view  1*/}
        {value === 1 && admin_manage_promotion_cycle.state === "success" && (
          <Box
            className="panel-con"
            sx={{
              height: "calc(100vh - 445px)",
              minHeight: "calc(500px)",
            }}
          >
            <NotificationHub
              loading={admin_manage_promotion_cycle.stat_state === "loading"}
              requests={admin_manage_promotion_cycle.promotionRequests}
              promotionCycle={admin_manage_promotion_cycle.activePromotionCycle}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
