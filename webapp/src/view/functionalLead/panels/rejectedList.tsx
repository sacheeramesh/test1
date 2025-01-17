import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useEffect } from "react";

import { LoadingEffect } from "@component/ui/loading";
import CustomTable, { Header } from "@component/tables/customTable";
import {
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import StateWithImage from "@component/ui/stateWithImage";

import { getRejectedPromotionRequests } from "@slices/functionalLeadSlices/rejectedList";
import { Cached,ExpandMore } from "@mui/icons-material";
import BackgroundLoader from "@component/common/backgroundLoader";
import { capitalizedFLWords, getIndexBasedRowColor } from "@utils/utils";
import { PromotionRequest } from "@utils/types";

export default function SubmittedRequests() {
  //redux dispatch / states
  const dispatch = useAppDispatch();
  const fl_rejected_list = useAppSelector(
    (state: RootState) => state.fl_rejected_list
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

  const theme = useTheme();

  useEffect(() => {
    if (fl_rejected_list.state !== 'loading') {
      dispatch(getRejectedPromotionRequests());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundLoader
        open={fl_rejected_list.backgroundProcess}
        message={fl_rejected_list.backgroundProcessMessage}
      />
      {fl_rejected_list.state !== "loading" && (
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
                onClick={() => dispatch(getRejectedPromotionRequests())}
              >
                <Cached />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      )}

      <Box className="panel-container">
        {fl_rejected_list.state === "loading" && (
          <LoadingEffect message={fl_rejected_list.stateMessage} />
        )}

        {fl_rejected_list.state === "success" &&
          fl_rejected_list.requests &&
          fl_rejected_list.requests?.length > 0 && (
            <CustomTable
              hideSelection={true}
              requests={fl_rejected_list.requests}
              headers={headers}
              setIndexRowColor={(idx: number) => {
                return getIndexBasedRowColor(idx, theme);
              }}
              fileName="functional-leader-rejected-promotion-requests"
            />
          )}

        {fl_rejected_list.state === "success" &&
          fl_rejected_list.requests?.length === 0 && (
            <StateWithImage
              imageUrl="/not-found.svg"
              message="There are no pending promotion requests"
            />
          )}
      </Box>
    </>
  );
}
