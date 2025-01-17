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

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import GroupsIcon from "@mui/icons-material/Groups";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";


import SubmittedRequests from "./panels/submittedRequests";
import RejectedList from "./panels/rejectedList";
import ApprovedList from "./panels/approvedList";

import { Check, Close, PlaylistRemove } from "@mui/icons-material";


export default function FunctionalLead() {
  const [value, setValue] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = ["active-promotion-request", "approved-list", "rejected-list"];

  
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
                  sx={{
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <IconButton
                    color="primary"
                    component="label"
                    onClick={() => {}}
                  >
                    <GroupsIcon fontSize="large" />
                  </IconButton>
                  <Typography
                    variant="h5"
                    sx={{ marginTop: "14px", marginLeft: "10px" }}
                  >
                    Functional Lead Portal
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
                  icon={<PlaylistAddCircleIcon />}
                  label="Active Promotion Requests"
                  onClick={() => setSearchParams({ tab: tabs[0] })}
                />
                <Tab
                  icon={<Check />}
                  label="Approved Requests"
                  onClick={() => setSearchParams({ tab: tabs[1] })}
                />
                 <Tab 
                  icon={<Close />}
                  label="Rejected Requests"
                  onClick={() => setSearchParams({ tab: tabs[2] })}
                />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <SubmittedRequests />
            </TabPanel>
            <TabPanel value={value} index={1}>
             <ApprovedList/>
            </TabPanel>
            <TabPanel value={value} index={2}>
            <RejectedList/>
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


