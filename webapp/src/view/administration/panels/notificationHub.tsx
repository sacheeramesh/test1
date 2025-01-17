import { Check, Close, Send } from "@mui/icons-material";
import {
  Box,
  Tab,
  Grid,
  Tabs,
  Typography,
  Stack,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  ActivePromotionCycleInterface,
  ApplicationState,
  PromotionRequest,
} from "@utils/types";
import React from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { RootState, useAppSelector, useAppDispatch } from "@slices/store";
import { notifyApplicant } from "@slices/adminSlices/notificationHub";

import CustomTable, { Header } from "@component/tables/customTable";
import { formatTimeStampToUTC, getIndexBasedRowColor } from "@utils/utils";
import { useConfirmationModalContext } from "@context/dialogContext";
import { LoadingButton } from "@mui/lab";
import BackgroundLoader from "@component/common/backgroundLoader";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { PROMOTION_CYCLE_STATUS } from "@config/config";

function NotificationHub(props: {
  requests: PromotionRequest[] | null;
  promotionCycle: ActivePromotionCycleInterface | null;
  loading: boolean;
}) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const dialogContext = useConfirmationModalContext();

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const admin_notification_hub = useAppSelector(
    (state: RootState) => state.admin_notification_hub
  );

  const rejectedList = props.requests
    ? props.requests.filter(
        (req) =>
          (req.status === ApplicationState.REJECTED ||
            req.status === ApplicationState.FL_REJECTED) &&
          !req.isNotificationEmailSent &&
          !admin_notification_hub.doneList.includes(req.id)
      )
    : [];

  const sentList = props.requests
    ? props.requests.filter(
        (req) =>
          (req.status === ApplicationState.REJECTED ||
            req.status === ApplicationState.FL_REJECTED ||
            req.status === ApplicationState.APPROVED) &&
          (req.isNotificationEmailSent ||
            admin_notification_hub.doneList.includes(req.id))
      )
    : [];

  const approvedList = props.requests
    ? props.requests.filter(
        (req) =>
          req.status === ApplicationState.APPROVED &&
          !req.isNotificationEmailSent &&
          !admin_notification_hub.doneList.includes(req.id)
      )
    : [];

  const multipleSend = (ids: number[]) => {
    dialogContext.showConfirmation(
      "",
      <>Would you like to send a notifications to selected List ?</>,
      (value?: string) => {
        ids.forEach((id) => {
          dispatch(notifyApplicant({ id: id, effectiveDate: value }));
        });
      },
      "Send",
      "No",
      {
        label: "Effective Date * ",
        mandatory: true,
        type: "textarea",
      }
    );
  };

  const multipleSendRejected = (ids: number[]) => {
    dialogContext.showConfirmation(
      "",
      <>Would you like to send a notifications to selected List ?</>,
      (value?: string) => {
        ids.forEach((id) => {
          dispatch(notifyApplicant({ id: id, effectiveDate: value }));
        });
      },
      "Send"
    );
  };

  var headers: Header[] = [
    {
      id: "employeeEmail",
      label: "Employee Email",
      sortable: true,
      type: "string",
      width: 1,
      align: "left",
    },
    {
      id: "promotionType",
      label: "Promotion Type",
      type: "string",
      sortable: true,
      width: 0.8,
      align: "left",
    },
    {
      id: "location",
      label: "Location",
      sortable: true,
      type: "string",
      width: 0.9,
      align: "left",
    },
    {
      id: "currentJobRole",
      label: "Current Designation",
      sortable: true,
      type: "string",
      width: 1,
      align: "center",
    },
    {
      id: "joinDate",
      label: "Joined date",
      sortable: true,
      type: "date",
      width: 1,
      align: "center",
    },
    {
      id: "lastPromotedDate",
      label: "Last promoted Date",
      sortable: true,
      type: "date",
      width: 1,
      align: "center",
    },

    {
      id: "currentJobBand",
      label: "Current Job Band",
      sortable: true,
      type: "number",
      width: 1,
      align: "center",
    },
    {
      id: "nextJobBand",
      label: "Applied Job Band",
      sortable: true,
      type: "number",
      width: 1,
      align: "center",
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      type: "string",
      width: 2,
      align: "center",
    },
    {
      id: "action",
      label: "Action",
      type: "action",
      width: 2,
      align: "right",

      render: (data: PromotionRequest, setExpand?: (id: any) => void) => {
        return (
          <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
            <Tooltip title={"Send Notification"}>
              {data.status === ApplicationState.APPROVED ? (
                <LoadingButton
                  startIcon={<Send />}
                  loading={admin_notification_hub.processingList.includes(
                    data.id
                  )}
                  disabled={
                    data.isNotificationEmailSent ||
                    admin_notification_hub.doneList.includes(data.id)
                  }
                  color="secondary"
                  onClick={() => {
                    dialogContext.showConfirmation(
                      "",
                      <>
                        Would you like to send a notification to{" "}
                        {data.employeeEmail} ?
                      </>,
                      (value?: string) => {
                        dispatch(
                          notifyApplicant({
                            id: data.id,
                            effectiveDate: value,
                            showFeedback: true,
                          })
                        );
                      },
                      "Send",
                      "No",
                      {
                        label: "Efective Date * ",
                        mandatory: true,
                        type: "textarea",
                      }
                    );
                  }}
                >
                  Send Notification
                </LoadingButton>
              ) : (
                <LoadingButton
                  startIcon={<Send />}
                  loading={admin_notification_hub.processingList.includes(
                    data.id
                  )}
                  disabled={
                    data.isNotificationEmailSent ||
                    admin_notification_hub.doneList.includes(data.id)
                  }
                  color="error"
                  onClick={() => {
                    dialogContext.showConfirmation(
                      "",
                      <>
                        Would you like to send a notification to{" "}
                        {data.employeeEmail} ?
                      </>,
                      (value?: string) => {
                        dispatch(
                          notifyApplicant({ id: data.id, showFeedback: true })
                        );
                      },
                      "Send",
                      "No"
                    );
                  }}
                >
                  Send Notification
                </LoadingButton>
              )}
            </Tooltip>
            {/* <IconButton
              onClick={() => {
                setExpand && setExpand(data.id);
              }}
            >
              <ExpandMore />
            </IconButton> */}
          </Stack>
        );
      },
    },
  ];

  var headerSent: Header[] = [
    {
      id: "employeeEmail",
      label: "Employee Email",
      sortable: true,
      type: "string",
      width: 1,
      align: "left",
    },
    {
      id: "promotionType",
      label: "Promotion Type",
      type: "string",
      sortable: true,
      width: 0.8,
      align: "left",
    },
    {
      id: "location",
      label: "Location",
      sortable: true,
      type: "string",
      width: 0.9,
      align: "left",
    },
    {
      id: "currentJobRole",
      label: "Current Designation",
      sortable: true,
      type: "string",
      width: 1,
      align: "center",
    },
    {
      id: "joinDate",
      label: "Joined date",
      sortable: true,
      type: "date",
      width: 1,
      align: "center",
    },
    {
      id: "lastPromotedDate",
      label: "Last promoted Date",
      sortable: true,
      type: "date",
      width: 1,
      align: "center",
    },

    {
      id: "currentJobBand",
      label: "Current Job Band",
      sortable: true,
      type: "number",
      width: 1,
      align: "center",
    },
    {
      id: "nextJobBand",
      label: "Applied Job Band",
      sortable: true,
      type: "number",
      width: 1,
      align: "center",
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      type: "string",
      width: 2,
      align: "center",
    },
    {
      id: "updatedOn",
      label: "Notified Timestamp",
      sortable: false,
      type: "string",
      width: 2.2,
      align: "right",
      formatter: formatTimeStampToUTC,
    },
  ];

  return (
    <>
      <BackgroundLoader
        open={admin_notification_hub.processingList.length > 0}
        message={admin_notification_hub.backgroundProcessMessage}
      />
      <Box
        className="panel-con"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {props.promotionCycle?.status === "CLOSED" ? (
          <Box
            className="panel-con"
            sx={{
              height: "calc(100vh - 445px)",
              minHeight: "calc(500px)",
              width: "100%",
            }}
          >
            {props.loading && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  paddingTop: "150px",
                }}
              >
                <Typography variant="h6" fontWeight={500} sx={{ mt: 1 }}>
                  Fetching Promotion Applications ...{" "}
                </Typography>
              </Grid>
            )}

            {!props.loading && (
              <>
    
                <Box
                  sx={{
                    flexGrow: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    height: "calc( 100% - 20px)",
                    mt: "20px",
                  }}
                >
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    <Tab
                      icon={<Check />}
                      label="Approved Applications"
                      {...a11yProps(0)}
                    />
                    <Tab
                      icon={<Close />}
                      label="Rejected Applications"
                      {...a11yProps(1)}
                    />
                    <Tab
                      icon={<MarkEmailReadIcon />}
                      label="Sent Notifications"
                      {...a11yProps(2)}
                    />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <Box
                      sx={{
                        m: "10px",
                        display: "flex",
                        flexDirection: "column",
                        width: "calc(100% - 20px)",
                        height: "calc(100% - 20px)",
                      }}
                    >
                      <Box sx={{ width: "100%", flex: 1 }}>
                        {approvedList.length > 0 && (
                          <Box className="panel-container-sub-view">
                            <CustomTable
                              approveText="Notify for selected Approved Applicants"
                              requests={approvedList}
                              fileName="approved_applicants_list"
                              headers={headers}
                              multipleApprove={multipleSend}
                              setIndexRowColor={(idx: number) => {
                                return getIndexBasedRowColor(idx, theme);
                              }}
                            />
                          </Box>
                        )}

                        {approvedList.length === 0 && (
                          <Typography variant="h5" sx={{ m: "30px" }}>
                            No records found
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box
                      sx={{
                        m: "10px",
                        display: "flex",
                        flexDirection: "column",
                        width: "calc(100% - 20px)",
                        height: "calc(100% - 20px)",
                      }}
                    >
                      <Box sx={{ width: "100%", height: "100%" }}>
                        <>
                          {rejectedList.length > 0 && (
                            <Box className="panel-container-sub-view">
                              <CustomTable
                                approveText="Notify for selected rejected applicants"
                                requests={rejectedList}
                                headers={headers}
                                fileName="rejected_applicants_list"
                                multipleApprove={multipleSendRejected}
                                setIndexRowColor={(idx: number) => {
                                  return getIndexBasedRowColor(idx, theme);
                                }}
                              />
                            </Box>
                          )}
                          {rejectedList.length === 0 && (
                            <Typography variant="h5" sx={{ m: "30px" }}>
                              No records found
                            </Typography>
                          )}
                        </>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Box
                      sx={{
                        m: "10px",
                        display: "flex",
                        flexDirection: "column",
                        width: "calc(100% - 20px)",
                        height: "calc(100% - 20px)",
                      }}
                    >
                      <Box sx={{ width: "100%", height: "100%" }}>
                        <>
                          {sentList.length > 0 && (
                            <Box className="panel-container-sub-view">
                              <CustomTable
                                hideSelection={true}
                                requests={sentList}
                                headers={headerSent}
                                fileName="sent_notifications"
                                setIndexRowColor={(idx: number) => {
                                  return getIndexBasedRowColor(idx, theme);
                                }}
                              />
                            </Box>
                          )}
                          {sentList.length === 0 && (
                            <Typography variant="h5" sx={{ m: "30px" }}>
                              No records found
                            </Typography>
                          )}
                        </>
                      </Box>
                    </Box>
                  </TabPanel>
                </Box>
              </>
            )}
          </Box>
        ) : props.promotionCycle ? (
          <Typography variant="h5" sx={{ m: "30px" }}>
            In order to activate notification Hub, the Promotion cycle must be
            in <b>CLOSED</b> state.
          </Typography>
        ) : (
          <Typography variant="h5" sx={{ m: "30px" }}>
            No promotion cycle found
          </Typography>
        )}
      </Box>
    </>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default NotificationHub;
