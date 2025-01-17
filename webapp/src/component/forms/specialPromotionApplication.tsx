import { useAppDispatch, useAppSelector, RootState } from "../../slices/store";

import {
  Autocomplete,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoadingButton from "@mui/lab/LoadingButton";

import { Grid, Typography, IconButton } from "@mui/material";
import { AppConfig } from "@config/config";
import { useConfirmationModalContext } from "@context/dialogContext";
import EmployeeSelector from "@component/forms/components/employeeSelector";

import { Link } from "react-router-dom";

import RichTextField from "@component/forms/components/richEditor";
import { SpecialPromotionRequestSubmitDialog } from "@config/constant";
import UserImage from "@component/ui/userImage";

import { useState } from "react";
import { Employee } from "@utils/types";
import { requestSpecialPromotion } from "@slices/specialPromotionSlice/specialPromotion";
import PromotionTimeLine from "@component/promotion/timeline";

function SpecialPromotionApplicationForm() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jobBands, setJobBands] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  ]);
  const [requestedJobBand, setRequestedJobBand] = useState<number | null>(null);
  const [promotionStatement, setPromotionStatement] = useState<string | null>(
    null
  );

  const [user, setUser] = useState<Employee | null>(null);

  const specialPromotion = useAppSelector(
    (state: RootState) => state.specialPromotion
  );

  const auth = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();
  const dialogContext = useConfirmationModalContext();

  const [openPromotionHistory, setOpenPromotionHistory] = useState(false);

  function encodeBase64Unicode(input: any) {
    // Convert to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(input);

    // Convert UTF-8 bytes to Base64
    return btoa(String.fromCharCode(...utf8Bytes));
  }
  return (
    <>
      {specialPromotion.activePromotionCycle && (
        <Grid
          container
          spacing={1}
          className="form"
          sx={{ paddingLeft: "10px" }}
        >
          <Grid
            container
            item
            xs={6}
            direction={"row"}
            sx={{ paddingLeft: "10px", marginTop: "10px" }}
          >
            <>
              <Grid
                item
                xs={5}
                style={{
                  marginBottom: 10,
                  justifyContent: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">Select Employee:</Typography>
              </Grid>
              <Grid item xs={5} style={{ marginBottom: 10 }}>
                <EmployeeSelector
                  isLeadsOnly={false}
                  exclude={auth.userInfo?.email ? [auth.userInfo.email] : []}
                  value={user}
                  setValue={(value: Employee | null) => {
                    setUser(value);
                    setRequestedJobBand(null);
                  }}
                />
              </Grid>
              {user && (
                <>
                  <Grid item xs={2} style={{ marginBottom: 10 }}></Grid>
                  <Grid item xs={5} style={{ marginBottom: 10 }}>
                    <Typography variant="h5">Employee First Name</Typography>
                  </Grid>
                  <Grid item xs={7} style={{ marginBottom: 10 }}>
                    <TextField
                      name={"immediateLeadEmail"}
                      size="small"
                      disabled
                      value={user.firstName}
                      inputProps={{ "aria-label": "description" }}
                      style={{
                        width: 300,
                        justifyContent: "center",
                      }}
                    />
                  </Grid>

                  <Grid item xs={5} style={{ marginBottom: 10 }}>
                    <Typography variant="h5">Employee Last Name</Typography>
                  </Grid>
                  <Grid item xs={7} style={{ marginBottom: 10 }}>
                    <TextField
                      name={"immediateLeadEmail"}
                      size="small"
                      disabled
                      value={user.lastName}
                      inputProps={{ "aria-label": "description" }}
                      style={{
                        width: 300,
                        justifyContent: "center",
                      }}
                    />
                  </Grid>

                  {/* Application JobBand */}
                  <Grid item xs={5} style={{ marginBottom: 10 }}>
                    <Typography variant="h5">Current Job Band:</Typography>
                  </Grid>
                  <Grid item xs={7} style={{ marginBottom: 10 }}>
                    <TextField
                      name={"immediateLeadEmail"}
                      size="small"
                      disabled
                      value={user.jobBand}
                      inputProps={{ "aria-label": "description" }}
                      style={{
                        width: 300,
                        justifyContent: "center",
                      }}
                    />
                    <IconButton
                      component={Link}
                      target="blank"
                      to={AppConfig.files.jobBandFile}
                      color="secondary"
                      aria-label="info"
                    >
                      <InfoIcon className="infoIcon" />
                    </IconButton>
                  </Grid>
                  <Grid item xs={5} style={{ marginBottom: 10 }}>
                    <Typography variant="h5">
                      Recommended Job Band{" "}
                      <span style={{ color: "red" }}>*</span> :{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} style={{ marginBottom: 10 }}>
                    <Autocomplete
                      disablePortal
                      size="small"
                      onChange={(_, value) => {
                        setRequestedJobBand(value);
                      }}
                      value={requestedJobBand}
                      id="combo-box-demo1"
                      options={jobBands.filter((item) => item > user.jobBand)}
                      getOptionLabel={(option) => option.toString()} // Ensure options are displayed as strings
                      sx={{ width: "300px" }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5" style={{ marginRight: 8 }}>
                      View Promotion History
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="View Promotion History"
                      onClick={() => {
                        setOpenPromotionHistory(true);
                      }}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Grid>
                </>
              )}
            </>
          </Grid>
          <Grid
            container
            item
            xs={6}
            direction={"row"}
            sx={{ paddingLeft: "10px", marginTop: "10px" }}
          >
            {user && (
              <>
                <Grid item xs={4} style={{ marginBottom: 10 }}>
                  <UserImage
                    variant="rounded"
                    size={150}
                    name={user.firstName + " " + user.lastName}
                    email={user.workEmail}
                    src={user.employeeThumbnail}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Conditional rendering for the popup */}
          {openPromotionHistory && user && (
            <Dialog
              onClose={() => setOpenPromotionHistory(false)}
              open={openPromotionHistory}
            >
              <DialogTitle>Promotion History - {user.workEmail}</DialogTitle>
              <PromotionTimeLine employeeEmail={user.workEmail} />
            </Dialog>
          )}

          {/* Promotion Statement */}
          {user && (
            <>
              <Grid item xs={11}></Grid>
              <Grid item xs={11}>
                <Typography
                  variant="h5"
                  style={{
                    marginBottom: 10,
                    justifyContent: "left",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Explain in detail why you would like to recommend the
                  individual for a promotion - Provide specific examples that
                  showcase strong work ethic, skill set, leadership, maturity
                  etc. <span style={{ color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  minHeight: "270px",
                  height: "100px",
                }}
              >
                <RichTextField
                  disable={false}
                  onChange={(value) => {
                    setPromotionStatement(value);
                  }}
                  value={promotionStatement ? promotionStatement : ""}
                />

                {/* Control buttons */}
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    paddingTop: "20px",
                  }}
                >
                  <Stack direction="row" spacing={2} marginBottom={"20px"}>
                    <LoadingButton
                      size="large"
                      onClick={() =>
                        dialogContext.showConfirmation(
                          SpecialPromotionRequestSubmitDialog.title,
                          SpecialPromotionRequestSubmitDialog.message,
                          () => {
                            requestedJobBand &&
                              specialPromotion.activePromotionCycle?.id &&
                              promotionStatement &&
                              dispatch(
                                requestSpecialPromotion({
                                  promotionId:
                                    specialPromotion.activePromotionCycle.id,
                                  employeeEmail: user.workEmail,
                                  jobBand: requestedJobBand,
                                  promotionStatement:
                                    encodeBase64Unicode(promotionStatement),
                                  reset: () => {
                                    setUser(null);
                                    setRequestedJobBand(null);
                                    setPromotionStatement(null);
                                  },
                                })
                              );
                          },
                          SpecialPromotionRequestSubmitDialog.okText
                        )
                      }
                      color="success"
                      variant="contained"
                      className="saveDraft"
                      sx={{ boxShadow: "none" }}
                      disabled={
                        !(
                          requestedJobBand &&
                          user &&
                          promotionStatement &&
                          promotionStatement.replace(/<\/?[^>]+(>|$)/g, "") !==
                            ""
                        )
                      }
                    >
                      {"Submit"}
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      )}

      {!specialPromotion.activePromotionCycle &&
        "There are no active promotion cycle"}
    </>
  );
}

export default SpecialPromotionApplicationForm;
