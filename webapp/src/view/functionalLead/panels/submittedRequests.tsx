import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useEffect, useState } from "react";

import { LoadingEffect } from "@component/ui/loading";
import CustomTable, { Header } from "@component/tables/customTable";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import StateWithImage from "@component/ui/stateWithImage";

import { getActivePromotionRequests } from "@slices/functionalLeadSlices/activeRequest";
import { Cached, Check, Close, ExpandMore, Edit } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";
import { capitalizedFLWords, getIndexBasedRowColor } from "@utils/utils";
import { PromotionRequest } from "@utils/types";
import { useConfirmationModalContext } from "@context/dialogContext";

import {
  approveFLPromotionRequest,
  rejectFLPromotionRequest,
  approveFLPromotionRequestList,
  rejectFLPromotionRequestList,
} from "@slices/functionalLeadSlices/activeRequest";
import { savePromotionApplication } from "@slices/promotionSlice/promotion";
import { enqueueSnackbarMessage } from "@slices/commonSlice/common";

export default function SubmittedRequests() {
  //redux dispatch / states
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const fl_approvedList = useAppSelector(
    (state: RootState) => state.fl_requests
  );

  const promotionRequestState = useAppSelector(
    (state: RootState) => state.promotion
  );

  const dialogContext = useConfirmationModalContext();
  const [editDialog, setEditDialog] = useState<{
    request?: PromotionRequest;
    promotingJobBand?: number;
    open: boolean;
  }>({
    open: false,
  });

  const [jobBands, setJobBands] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  ]);

  var headers: Header[] = [
    {
      id: "employeeEmail",
      label: "Employee Email",
      sortable: true,
      type: "string",
      width: 1.3,
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
      id: "businessUnit",
      label: "Business Unit",
      sortable: true,
      type: "string",
      width: 1,
      align: "center",
      formatter: capitalizedFLWords,
    },
    {
      id: "department",
      label: "Department",
      sortable: true,
      type: "string",
      width: 1,
      align: "center",
      formatter: capitalizedFLWords,
    },
    {
      id: "team",
      label: "Team",
      type: "string",
      sortable: true,
      width: 1,
      align: "center",
      formatter: capitalizedFLWords,
    },

    {
      id: "currentJobBand",
      label: "Current Job Band",
      sortable: true,
      type: "number",
      width: 0.6,
      align: "center",
    },
    {
      id: "nextJobBand",
      label: "Applied Job Band",
      sortable: true,
      type: "number",
      width: 0.6,
      align: "center",
    },
    {
      id: "action",
      label: "Action",
      type: "action",
      width: 1.5,
      align: "right",

      render: (data: PromotionRequest, setExpand?: (id: any) => void) => {
        return (
          <Stack direction="row" spacing={0} sx={{ height: "40px" }}>
            {/* Edit  */}
            <IconButton
              color="secondary"
              onClick={() => {
                setEditDialog({
                  request: data,
                  open: true,
                });
              }}
            >
              <Edit />
            </IconButton>

            {/* Approve */}
            <IconButton
              color="secondary"
              onClick={() => {
                dialogContext.showConfirmation(
                  "",
                  <>
                    Do you want to <b>approve</b> this promotion request?{" "}
                  </>,
                  () => {
                    dispatch(approveFLPromotionRequest(data.id));
                  },
                  "approve"
                );
              }}
            >
              <Check />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => {
                dialogContext.showConfirmation(
                  "",
                  <>
                    Do you want to <b>reject</b> this promotion request?{" "}
                  </>,
                  (value?: string) => {
                    dispatch(
                      rejectFLPromotionRequest({
                        id: data.id,
                        reason: value ?? "--default-reason--",
                      })
                    );
                  },
                  "reject",
                  "No",
                  {
                    label: "Reason for rejection * ",
                    mandatory: true,
                    type: "textarea",
                  }
                );
              }}
            >
              <Close />
            </IconButton>

            <IconButton
              onClick={() => {
                setExpand && setExpand(data.id);
              }}
            >
              <ExpandMore />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  useEffect(() => {
    if (fl_approvedList.state !== "loading") {
      dispatch(getActivePromotionRequests());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (promotionRequestState.state == "success") {
      dispatch(getActivePromotionRequests());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionRequestState.state]);

  const multipleApprove = (ids: number[]) => {
    dialogContext.showConfirmation(
      "",
      <>
        Do you want to <b>Approve</b>{" "}
        {ids.length > 1
          ? "these promotion requests"
          : " this promotion request"}
        ?
      </>,
      () => {
        dispatch(approveFLPromotionRequestList(ids));
      },
      "Approve"
    );
  };

  const multipleReject = (ids: number[]) => {
    dialogContext.showConfirmation(
      "",
      <>
        Do you want to <b>Reject</b>{" "}
        {ids.length > 1
          ? "these promotion requests"
          : " this promotion request"}
        ?
      </>,
      (value?: string) => {
        dispatch(
          rejectFLPromotionRequestList({
            ids: ids,
            reason: value ?? "--default-reason--",
          })
        );
      },
      "Reject",
      "No",
      {
        label: "Common reason for rejection * ",
        mandatory: true,
        type: "textarea",
      }
    );
  };

  return (
    <>
      {promotionRequestState.state == "loading" && (
        <BackgroundLoader
          open={promotionRequestState.backgroundProcess}
          message={promotionRequestState.backgroundProcessMessage}
        />
      )}

      <BackgroundLoader
        open={fl_approvedList.backgroundProcess}
        message={fl_approvedList.backgroundProcessMessage}
      />
      {fl_approvedList.state !== "loading" && (
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
          <ButtonGroup>
            <Tooltip title={"Refresh Page"}>
              <IconButton
                size="small"
                onClick={() => dispatch(getActivePromotionRequests())}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}

      <Box className="panel-container">
        {fl_approvedList.state === "loading" && (
          <LoadingEffect message={fl_approvedList.stateMessage} />
        )}

        {fl_approvedList.state === "success" &&
          fl_approvedList.requests &&
          fl_approvedList.requests?.length > 0 && (
            <CustomTable
              requests={fl_approvedList.requests}
              headers={headers}
              multipleApprove={multipleApprove}
              multipleReject={multipleReject}
              setIndexRowColor={(idx: number) => {
                return getIndexBasedRowColor(idx, theme);
              }}
              fileName="functional-leader-promotion-requests"
            />
          )}

        {fl_approvedList.state === "success" &&
          fl_approvedList.requests?.length === 0 && (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There are no pending promotion requests"
            />
          )}
      </Box>

      {/* Edit Dialog */}
      {editDialog.open && (
        <Dialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false })}
          maxWidth={"sm"}
          PaperProps={{
            sx: {
              overflow: "visible", // Prevent the dialog from clipping the dropdown
            },
          }}
        >
          <DialogTitle>Update Application Job Band</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ width: "100%" }}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={5}>
                  <Typography variant="h5">Current Job Band:</Typography>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    name={"immediateLeadEmail"}
                    size="small"
                    disabled
                    value={editDialog.request?.currentJobBand}
                    inputProps={{ "aria-label": "description" }}
                    style={{
                      width: 250,
                      justifyContent: "center",
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="h5">
                    Recommended Job Band <span style={{ color: "red" }}>*</span>{" "}
                    :{" "}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    defaultValue={editDialog.request?.nextJobBand}
                    id="updateJobBand"
                    options={jobBands.filter(
                      (item) => item > (editDialog.request?.currentJobBand ?? 0)
                    )}
                    getOptionLabel={(option) => option.toString()} // Ensure options are displayed as strings
                    sx={{ width: "250px" }}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(event, value) => {
                      setEditDialog((prev) => ({
                        ...prev,
                        promotingJobBand: value ?? undefined, // Update only promotingJobBand
                      }));
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid
              container
              spacing={1}
              className="form"
              sx={{ paddingLeft: "10px" }}
            >
              <Grid
                container
                xs={6}
                direction={"row"}
                sx={{ paddingLeft: "10px", marginTop: "10px" }}
              ></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditDialog({ open: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editDialog.promotingJobBand == null) {
                  dispatch(
                    enqueueSnackbarMessage({
                      message: "Nothing to update",
                      type: "warning",
                    })
                  );
                } else if (
                  editDialog.promotingJobBand == editDialog.request?.nextJobBand
                ) {
                  dispatch(
                    enqueueSnackbarMessage({
                      message:
                        "Please select a valid job band other than the current promotion job band.",
                      type: "warning",
                    })
                  );
                } else {
                  dialogContext.showConfirmation(
                    "",
                    <>
                      Do you want to <b>update</b> this promotion request?{" "}
                    </>,
                    (value?: string) => {
                      dispatch(
                        savePromotionApplication({
                          id: editDialog.request?.id ?? 0,
                          promotingJobBand: editDialog.promotingJobBand ?? 0,
                        })
                      );
                    },
                    "Yes"
                  );
                  setEditDialog({ open: false });
                }
              }}
              color="secondary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
