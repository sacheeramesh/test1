import { TextField, Stack, Button } from "@mui/material";
import { Typography } from "@mui/material";

import {
  ApplicationState,
  updateRecommendationLeadEmail,
} from "@slices/promotionSlice/promotion";
import { useAppDispatch } from "@slices/store";
import { Employee } from "@utils/types";
import EmployeeSelector from "./employeeSelector";

export default function RecommendationLine(props: {
  exclude?: string[];
  leadEmail: string | null;
  isDirectLead: boolean;
  leadList: string[];
  isSample: boolean;
  state: ApplicationState | null;
  index: number;
  action: () => void;
}) {
  const isDisabledAction = (state: ApplicationState | null) => {
    if (!state) {
      return false;
    }

    return [
      ApplicationState.REQUESTED,
      ApplicationState.SUBMITTED,
      ApplicationState.DECLINED,
    ].includes(state);
  };

  const dispatch = useAppDispatch();

  const updateRecommendationLead = (index: number, value: string) => {
    dispatch(
      updateRecommendationLeadEmail({
        leadEmail: value,
        index: index,
      })
    );
  };

  return (
    <Stack direction="row" spacing={2} marginBottom={"20px"}>
      {props.isDirectLead || isDisabledAction(props.state) ? (
        <TextField
          name={"immediateLeadEmail"}
          size="small"
          disabled
          value={props.leadEmail}
          inputProps={{ "aria-label": "description" }}
          style={{
            width: 300,
            justifyContent: "center",
          }}
        />
      ) : (
      <>
        <EmployeeSelector
          disabled={isDisabledAction(props.state)}
          isLeadsOnly={true}
          exclude={props.exclude??[]}
          setValue={(value: Employee | null) =>
            updateRecommendationLead(props.index, value?.workEmail || "")
          }
            />
            </>
      )}

      {props.state === ApplicationState.DRAFT && (
        <>
          <Button
            className="request"
            variant="contained"
            disabled={!props.leadEmail}
            color="success"
            sx={{boxShadow: "none"}}
            onClick={() => {
              props.action();
            }}
          >
            request
          </Button>
        </>
      )}

      {!props.isSample && props.state !== ApplicationState.DRAFT && (
        <>
          <Typography className={"requested"}>{props.state}</Typography>
        </>
      )}
    </Stack>
  );
}
