import {
  Box,
  Fade,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  IconButton,
} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import PromotionPanel from "./panels/promotion";
import ApplicationHistoryPanel from "./panels/applicationHistory";

import PromotionHistoryPanel from "./panels/promotionHistory";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PromotionView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<number>(0);

  const tabs = ["apply-promotion", "applications-history", "promotion-history"];

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
    <Fade in={true}>
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
              sx={{
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
                    <AccountCircleIcon fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: "14px", marginLeft: "10px" }}
                  >
                    Promotion History
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
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon label tabs example"
              >
                <Tab
                  icon={<WorkHistoryIcon />}
                  label="Promotion History"
                  onClick={() => setSearchParams({ tab: tabs[0] })}
                />
                {/* Removed this tab because it is not used */}
                {/* <Tab
                  icon={<VerifiedIcon />}
                  label="Promotion Status"
                  onClick={() => setSearchParams({ tab: tabs[2] })}
                />
                <Tab
                  icon={<HistoryIcon />}
                  label="Applications History"
                  onClick={() => setSearchParams({ tab: tabs[1] })}
                /> */}
              </Tabs>
            </Box>
            {/* Removed this tab because it is not used */}
            {/* <TabPanel value={value} index={2}>
              <PromotionPanel />
            </TabPanel> */}
            {/* <TabPanel value={value} index={1}>
              <ApplicationHistoryPanel />
            </TabPanel> */}
            <TabPanel value={value} index={0}>
              <PromotionHistoryPanel />
            </TabPanel>
          </Grid>
        </Paper>
      </Grid>
    </Fade>
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
