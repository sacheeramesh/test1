import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import { LoadingEffect } from "@component/ui/loading";
import { ArrowForward, Cached } from "@mui/icons-material";
import Search from "@component/ui/search";
import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useConfirmationModalContext } from "@context/dialogContext";
import { TimeBasedPromotionCycleSubmitDialog } from "@config/constant";
import {
  checkSyncState,
  getTimeBasedPromotion,
  timeBasedPromotion,
} from "@slices/promotionSlice/promotion";
import { SyncState } from "@utils/types";

export default function TimeBasedPromotionPanel() {
  const [value, setValue] = useState("par-app");
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isChecked, setIsChecked] = useState(false);
  const [sheetValue, setSheetValue] = useState("");

  const dialogContext = useConfirmationModalContext();

  const dispatch = useAppDispatch();

  const promotions = useAppSelector((state: RootState) => state.promotion);
  const admin_users = useAppSelector((state: RootState) => state.admin_users);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleSheetInputChange = (event: any) => {
    setSheetValue(event.target.value);
  };

  const importPromotions = () => {
    dialogContext.showConfirmation(
      TimeBasedPromotionCycleSubmitDialog.title,
      TimeBasedPromotionCycleSubmitDialog.message,
      () => {
        if (value === "sheet") {
          setIsOpen(true);
        } else {
          // TODO: PAR app process
        }
      },
      TimeBasedPromotionCycleSubmitDialog.okText
    );
  };

  const syncTimeBasedPromotions = (url: string) => {
    dispatch(
      timeBasedPromotion({
        type: "SHEET",
        sheet: url,
      })
    );
  };

  const onChangeSearchKey = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSearchKey(value);
  };

  // Initial loading
  useEffect(() => {
    dispatch(checkSyncState());
    dispatch(getTimeBasedPromotion());
  }, []);

  // Initiate check sync status
  useEffect(() => {
    if (promotions.state === "success") {
      // Set a delay of 2 seconds before dispatching the action
      const timer = setTimeout(() => {
        dispatch(checkSyncState());
      }, 1000);

      // Cleanup the timer if the component is unmounted or if the state changes
      return () => clearTimeout(timer);
    }
  }, [promotions.state]);

  // Initial loading
  useEffect(() => {
    if (promotions.syncState === SyncState.SUCCESS) {
      dispatch(getTimeBasedPromotion());
    }
  }, [promotions.syncState]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {promotions.state === "loading" && (
        <LoadingEffect message={promotions.stateMessage} />
      )}

      {promotions.state === "success" && (
        <>
          {promotions.syncState === SyncState.IN_PROGRESS && (
            <InProgressLabel />
          )}
          {promotions.syncState != SyncState.IN_PROGRESS &&
            promotions.timeBasedRequests?.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "auto",
                    marginBottom: "2rem",
                  }}
                >
                  <IconButton
                    component="label"
                    sx={{ marginRight: "4px" }}
                    onClick={() => {
                      setIsChecked(!isChecked);
                    }}
                  >
                    <Cached />
                  </IconButton>
                  <Collapse orientation="horizontal" in={isChecked}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <TextField
                        autoFocus
                        id="name"
                        name="url"
                        placeholder="Sheet Link"
                        type="url"
                        fullWidth
                        variant="standard"
                        sx={{ marginRight: "5px" }}
                        value={sheetValue}
                        onChange={handleSheetInputChange}
                      />
                      <Button
                        onClick={() => {
                          syncTimeBasedPromotions(sheetValue);
                        }}
                        sx={{ padding: "0px" }}
                        variant="outlined"
                      >
                        Sync
                      </Button>
                    </Box>
                  </Collapse>

                  <Typography variant="h5" sx={{ flex: 1 }}>
                    {" "}
                  </Typography>
                  <Search value={searchKey} onChange={onChangeSearchKey} />
                </Box>
                <Box
                  className="panel-con"
                  sx={{
                    height: "calc(100vh - 404px)",
                    minHeight: "calc(544px)",
                  }}
                >
                  {promotions.timeBasedRequests
                    .filter((user) =>
                      searchKey === ""
                        ? true
                        : user.employeeEmail
                            .toLowerCase()
                            .includes(searchKey.toLowerCase())
                    )
                    .map((value) => (
                      <>
                        <Box
                          key={value.employeeEmail}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            height: "auto",
                            border: "1px dashed #e3e3e3",
                            p: 2,
                            marginBottom: "10px",
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid
                              item
                              xs={2.5}
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5">
                                {value.employeeEmail}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={5}
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {value.recommendations.map((role, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        label={"Lead: " + role.leadEmail}
                                        sx={{ m: "2px" }}
                                      />
                                    );
                                  })}
                                </Box>
                              </>
                            </Grid>
                            <Grid
                              item
                              xs={2.5}
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5">{value.team}</Typography>
                            </Grid>
                            <Grid
                              item
                              xs={2}
                              style={{
                                display: "flex",
                                justifyContent: "right",
                                alignItems: "center",
                              }}
                            >
                              <Chip
                                label={
                                  <Typography variant="h5">
                                    JB {value.currentJobBand}
                                  </Typography>
                                }
                                sx={{ m: "2px", background: "light-gray" }}
                              />
                              <ArrowForward />

                              <Chip
                                label={
                                  <Typography variant="h5">
                                    JB {value.nextJobBand}
                                  </Typography>
                                }
                                sx={{ m: "2px", background: "light-gray" }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </>
                    ))}
                </Box>
              </>
            )}

          {promotions.syncState != SyncState.IN_PROGRESS &&
            promotions.timeBasedRequests?.length === 0 && (
              <>
                <Box
                  className="panel-con"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "4rem",
                  }}
                >
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Set time-based promotions from:
                    </FormLabel>
                    <RadioGroup
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "1rem",
                      }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      <Card
                        sx={{
                          minWidth: 275,
                          boxShadow: "none",
                          border: "1px solid #ebebeb",
                          display: "flex",
                          padding: "1rem",
                          cursor: "pointer",
                          marginRight: "2rem",
                          backgroundColor: `${
                            value === "par-app" ? "#fbfbfb" : "#ffffff"
                          }`,
                        }}
                        onClick={() => setValue("par-app")}
                      >
                        <Box
                          sx={{
                            margin: "auto",
                            marginRight: "2rem",
                          }}
                        >
                          <FormControlLabel
                            value="par-app"
                            control={<Radio size="small" />}
                            label="PAR App"
                          />
                          <Typography
                            sx={{
                              width: "12rem",
                              fontSize: "12px",
                              color: "#666666",
                              letterSpacing: "0.3px",
                            }}
                          >
                            Import employees whom have 3 consecutive successful
                            ratings or above.
                          </Typography>
                        </Box>
                        <img
                          src="/par-rating.svg"
                          alt="Promotion Images"
                          width={150}
                        />
                      </Card>

                      <Card
                        sx={{
                          minWidth: 275,
                          boxShadow: "none",
                          border: "1px solid #ebebeb",
                          display: "flex",
                          padding: "1rem",
                          cursor: "pointer",
                          backgroundColor: `${
                            value === "sheet" ? "#fbfbfb" : "#ffffff"
                          }`,
                        }}
                        onClick={() => setValue("sheet")}
                      >
                        <Box
                          sx={{
                            margin: "auto",
                            marginRight: "2rem",
                          }}
                        >
                          <FormControlLabel
                            value="sheet"
                            control={<Radio size="small" />}
                            label="Google Sheet"
                          />
                          <Typography
                            sx={{
                              width: "12rem",
                              fontSize: "12px",
                              color: "#666666",
                              letterSpacing: "0.3px",
                            }}
                          >
                            Import list of employees from google sheet.
                          </Typography>
                        </Box>
                        <img
                          src="/sheet.svg"
                          alt="Promotion Images"
                          width={150}
                        />
                      </Card>
                    </RadioGroup>
                    <Button
                      onClick={importPromotions}
                      sx={{
                        mt: 4,
                        width: "12rem",
                        marginLeft: "auto",
                      }}
                      type="submit"
                      variant="contained"
                    >
                      Import
                    </Button>
                  </FormControl>
                </Box>
                {isOpen && (
                  <Dialog
                    open={isOpen}
                    onClose={handleClose}
                    PaperProps={{
                      component: "form",
                      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(
                          (formData as any).entries()
                        );
                        const url = formJson.url;

                        syncTimeBasedPromotions(url);
                        // TODO: REFRESH HERE
                        handleClose();
                      },
                    }}
                  >
                    <DialogTitle>Insert Google Sheet Link</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Employees will be imported and assigned promotions to
                        based on their job band.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="url"
                        label="Sheet Link"
                        type="url"
                        fullWidth
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button type="submit">Import</Button>
                    </DialogActions>
                  </Dialog>
                )}
              </>
            )}
        </>
      )}
    </>
  );
}

export function InProgressLabel() {
  const dispatch = useAppDispatch();
  const syncState = useAppSelector(
    (state: RootState) => state.admin_users.syncState
  );

  useEffect(() => {
    var intervalFunc = setInterval(() => {
      dispatch(checkSyncState());
    }, 2000);

    return () => {
      clearInterval(intervalFunc);
    };
  }, []);

  return <LoadingEffect message={"Syncing time-based promotions"} />;
}
