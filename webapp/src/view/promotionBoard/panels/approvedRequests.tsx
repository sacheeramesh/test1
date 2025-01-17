import React from "react";
import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useEffect } from "react";

import { LoadingEffect } from "@component/ui/loading";
import {
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import StateWithImage from "@component/ui/stateWithImage";

import { getApprovedRequests } from "@slices/promotionBoardSlice/approvedRequests";
import { Cached, ExpandMore } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";

import CustomTable, { Header } from "@component/tables/customTable";
import { capitalizedFLWords, getIndexBasedRowColor } from "@utils/utils";
import { PromotionRequest } from "@utils/types";
export default function FLRejectedList() {
  //redux dispatch / states
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const pb_approvedRequests = useAppSelector(
    (state: RootState) => state.pb_approvedRequests
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
      width: 1,
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

  useEffect(() => {
    if (pb_approvedRequests.state !== 'loading') {
      dispatch(getApprovedRequests());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const multipleApprove = (ids: number[]) => {};

  const multipleReject = (ids: number[]) => {};

  return (
    <>
     
      {pb_approvedRequests.state !== "loading" && (
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
                onClick={() => dispatch(getApprovedRequests())}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}
      <Box className="panel-container">
        {pb_approvedRequests.state === "loading" && (
          <LoadingEffect message={pb_approvedRequests.stateMessage} />
        )}

        {pb_approvedRequests.state === "success" &&
          pb_approvedRequests.requests &&
          pb_approvedRequests.requests?.length > 0 && (
            <CustomTable
              hideSelection
              requests={pb_approvedRequests.requests}
              headers={headers}
              multipleApprove={multipleApprove}
              multipleReject={multipleReject}
              setIndexRowColor={(idx: number) => {
                return getIndexBasedRowColor(idx, theme);
              }}
            />
          )}

        {pb_approvedRequests.state === "success" &&
          pb_approvedRequests.requests?.length === 0 && (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There are no approved promotion requests"
            />
          )}

        {pb_approvedRequests.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Something went wrong, while fetching approved promotion requests"
          />
        )}
      </Box>
    </>
  );
}
