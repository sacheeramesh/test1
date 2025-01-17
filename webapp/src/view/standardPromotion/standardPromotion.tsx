// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content. 

import {
  Box,
  Fade,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
import VerifiedIcon from "@mui/icons-material/Verified";

import SpecialPromotionPanel from "./panels/standardPromotion";
import ApplicationHistoryPanel from "./panels/applicationHistory";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Assistant } from "@mui/icons-material";

export default function PromotionView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<number>(0);

  const tabs = ["promotion-request", "submission-history"];

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
        <Grid sx={{ my: 2 }}>
          <Alert severity="info" color="info">
            <div>Note: This won't be part of the ongoing promotion cycle.</div>
            This process is used to promote employees outside of the regular promotion cycle.
          </Alert>
        </Grid>
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
                    <Assistant fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: "14px", marginLeft: "10px" }}
                  >
                    Standard Promotion Request
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
                  icon={<VerifiedIcon />}
                  label="Promotion Request"
                  onClick={() => setSearchParams({ tab: tabs[0] })}
                />
                <Tab
                  icon={<HistoryIcon />}
                  label="Submission History"
                  onClick={() => setSearchParams({ tab: tabs[1] })}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <SpecialPromotionPanel />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ApplicationHistoryPanel />
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
