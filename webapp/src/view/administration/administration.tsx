import {
  Box,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PromotionCycleManagePanel from "./panels/promotionCycle";
import WithdrawalRequestsPanel from "./panels/withdrawalRequest";
import UserManagementPanel from "./panels/userManagement";
import TimeBasedPromotionPanel from "./panels/timeBasedPromotion";

import ConstructionIcon from "@mui/icons-material/Construction";

export default function Administration(props: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<number>(0);
  const tabs = ["promotion-cycle", "time-based-promotion", "withdrawal-requests", "user-management"];

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && tabs.indexOf(currentTab) !== -1) {
      setValue(tabs.indexOf(currentTab));
    } else {
      searchParams.set("tab", tabs[0]);
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid item sx={{ m: 2 }}>
      <Paper
        square
        className="paper"
        variant="outlined"
        sx={{
          minHeight: "calc(800px)",
          borderRadius: "5px",
          minWidth: "1200px",
          height: "calc(100vh - 150px)",
        }}
      >
        <Grid item>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px",
            }}
          >
            <>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "left",
                }}
              >
                <IconButton
                  color="primary"
                  component="label"
                  onClick={() => {}}
                >
                  <ConstructionIcon fontSize="large" />
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{ marginTop: "14px", marginLeft: "10px" }}
                >
                  Admin Portal
                </Typography>
              </Grid>
              <Grid item></Grid>
            </>
          </Grid>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              padding: "0px 30px",
            }}
          >
            <Tabs value={value} onChange={handleChange}>
              <Tab
                icon={<AutoModeIcon />}
                label="Promotion Cycle"
                onClick={() => setSearchParams({ tab: tabs[0] })}
              />
              <Tab
                icon={<AccessTimeFilledIcon />}
                label="Time Based Promotions"
                onClick={() => setSearchParams({ tab: tabs[1] })}
              />
              <Tab
                icon={<AssignmentReturnIcon />}
                label="Withdrawal Requests"
                onClick={() => setSearchParams({ tab: tabs[2] })}
              />
              <Tab
                icon={<PeopleAltIcon />}
                label="User Management"
                onClick={() => setSearchParams({ tab: tabs[3] })}
              />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <PromotionCycleManagePanel />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TimeBasedPromotionPanel />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <WithdrawalRequestsPanel />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <UserManagementPanel />
          </TabPanel>
        </Grid>
      </Paper>
    </Grid>
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
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: "30px" }}>{children}</Box>}
    </div>
  );
}
