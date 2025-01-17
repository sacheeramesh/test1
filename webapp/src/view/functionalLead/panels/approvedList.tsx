import {
  Box,
  ButtonGroup,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import StateWithImage from "@component/ui/stateWithImage";
import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useEffect } from "react";
import { LoadingEffect } from "@component/ui/loading";
import CustomTable, { Header } from "@component/tables/customTable";
import { getFLApprovedPromotionRequests } from "@slices/functionalLeadSlices/approvedList";
import { Cached, ExpandMore } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";
import { capitalizedFLWords, transformFLState } from "@utils/utils";
import {
  ApplicationState,
  PromotionRequest,
  PromotionType,
} from "@utils/types";

export default function FunctionalLeadApprovedRequests() {
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const fl_approved_list = useAppSelector(
    (state: RootState) => state.fl_approved_list
  );

  var headers: Header[] = [
    {
      id: "employeeEmail",
      label: "Employee Email",
      sortable: true,
      type: "string",
      width: 1.4,
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
      id: "status",
      label: "Promotion Board Approval Status",
      sortable: true,
      type: "string",
      width: 1,
      align: "center",
      formatter: transformFLState,
    },
    {
      id: "action",
      label: "",
      type: "action",
      width: 0.2,
      align: "right",

      render: (data: PromotionRequest, setExpand?: (id: any) => void) => {
        return (
          <Stack direction="row" spacing={2} sx={{ height: "40px" }}>
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

  const setRowColor = (data: PromotionRequest) => {
    if (data.status === ApplicationState.APPROVED) {
      return theme.palette.mode === "light" ? "#e6f9f0" : "#00875A";
    } else if (data.status === ApplicationState.REJECTED) {
      return theme.palette.mode === "light" ? "#ffe6e6" : "#DE350B";
    } else if (data.status === ApplicationState.FL_APPROVED) {
      return theme.palette.background.default;
    } else {
      return "#fff";
    }
  };

  useEffect(() => {
    if (fl_approved_list.state !== "loading") {
      dispatch(getFLApprovedPromotionRequests());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundLoader
        open={fl_approved_list.backgroundProcess}
        message={fl_approved_list.backgroundProcessMessage}
      />
      {fl_approved_list.state === "success" && (
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
                onClick={() => dispatch(getFLApprovedPromotionRequests())}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
          <Stack direction={"row"} alignItems={"center"}>
            {fl_approved_list.requests &&
              fl_approved_list.requests?.length > 0 && (
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
                    All Count : {fl_approved_list.requests?.length}
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography
                    variant={"h5"}
                    sx={{ margin: "0px 20px", color: "#36B37E" }}
                  >
                    Promotion Board Approved Count :{" "}
                    {
                      fl_approved_list.requests?.filter(
                        (req) =>
                          req.status === ApplicationState.APPROVED &&
                          req.promotionType != PromotionType.TIME_BASED
                      ).length
                    }
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography
                    variant={"h5"}
                    sx={{ margin: "0px 20px", color: "#BF2600" }}
                  >
                    Promotion Board Rejected Count :{" "}
                    {
                      fl_approved_list.requests?.filter(
                        (req) => req.status === ApplicationState.REJECTED
                      ).length
                    }
                  </Typography>
                </Box>
              )}
          </Stack>
        </Box>
      )}

      <Box className="panel-container">
        {fl_approved_list.state === "loading" && (
          <LoadingEffect message={fl_approved_list.stateMessage} />
        )}

        {fl_approved_list.state === "success" &&
          fl_approved_list.requests &&
          fl_approved_list.requests?.length > 0 && (
            <CustomTable
              hideSelection={true}
              requests={fl_approved_list.requests}
              headers={headers}
              setRowColor={setRowColor}
              fileName="functional-leader-approved-promotion-requests"
            />
          )}

        {fl_approved_list.state === "success" &&
          fl_approved_list.requests?.length === 0 && (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There are no pending promotion requests"
            />
          )}
      </Box>
    </>
  );
}
