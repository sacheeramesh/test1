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

import { getRejectedRequests } from "@slices/promotionBoardSlice/rejectedRequests";
import { Cached, ExpandMore } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";

import CustomTable, { Header } from "@component/tables/customTable";
import { capitalizedFLWords, getIndexBasedRowColor } from "@utils/utils";
import { PromotionRequest } from "@utils/types";
export default function FLRejectedList() {
  //redux dispatch / states
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const pb_rejectedRequests = useAppSelector(
    (state: RootState) => state.pb_rejectedRequests
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
      label: "Action",
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
    if (pb_rejectedRequests.state !== 'loading') {
      dispatch(getRejectedRequests());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
     
      {pb_rejectedRequests.state !== "loading" && (
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
                onClick={() => dispatch(getRejectedRequests())}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}
      <Box className="panel-container">
        {pb_rejectedRequests.state === "loading" && (
          <LoadingEffect message={pb_rejectedRequests.stateMessage} />
        )}

        {pb_rejectedRequests.state === "success" &&
          pb_rejectedRequests.requests &&
          pb_rejectedRequests.requests?.length > 0 && (
            <CustomTable
              hideSelection
              requests={pb_rejectedRequests.requests}
              headers={headers}
              setIndexRowColor={(idx: number) => {
                return getIndexBasedRowColor(idx, theme);
              }}
            />
          )}

        {pb_rejectedRequests.state === "success" &&
          pb_rejectedRequests.requests?.length === 0 && (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There are no rejected promotion requests"
            />
          )}

        {pb_rejectedRequests.state === "failed" && (
          <StateWithImage
            imageUrl="/warning.svg"
            message="Something went wrong, while fetching rejected promotion requests"
          />
        )}
      </Box>
    </>
  );
}
