import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Abs from "./tree";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// function not(a: readonly number[], b: readonly number[]) {
//   return a.filter((value) => b.indexOf(value) === -1);
// }

// function intersection(a: readonly number[], b: readonly number[]) {
//   return a.filter((value) => b.indexOf(value) !== -1);
// }

// function union(a: readonly number[], b: readonly number[]) {
//   return [...a, ...not(b, a)];
// }

export default function TransferList() {
  const [buId, setBuId] = React.useState<number | null>(null);

  const [bu, setBu] = React.useState<readonly Entity[]>([]);
  const [departments, setDeparments] = React.useState<readonly Entity[]>([]);
  const [teams, setTeams] = React.useState<readonly Entity[]>([]);
  const [subTeams, setSubTeams] = React.useState<readonly Entity[]>([]);

  interface Entity {
    id: number;
    name: string;
  }
  interface TeamAccess extends Entity {
    subTeams?: Entity[];
  }
  interface DepartmentAccess extends Entity {
    teams?: TeamAccess[];
  }
  interface BUAccessLevel extends Entity {
    departments?: DepartmentAccess[];
  }
  React.useEffect(() => {
    const businessUnits: BUAccessLevel[] = [
      {
        id: 1,
        name: "Corporate",
        departments: [
          {
            id: 1,
            name: "ENGINEERING",
            teams: [
              {
                id: 1,
                name: "ENGINEERING",
                subTeams: [],
              },
              {
                id: 2,
                name: "BUSINESS OPERATIONS",
              },
              {
                id: 3,
                name: "ENGINEERING EFFICIENCY",
                subTeams: [
                  {
                    id: 1,
                    name: "LEADERSHIP GROUP",
                  },
                ],
              },
              {
                id: 4,
                name: "Site Reliability Engineering",
                subTeams: [],
              },
              {
                id: 5,
                name: "INTERN",
                subTeams: [],
              },
            ],
          },
          {
            id: 2,
            name: "HUMAN RESOURCES",
            teams: [
              {
                id: 1,
                name: "HR",
                subTeams: [],
              },
              {
                id: 2,
                name: "INTERN",
                subTeams: [],
              },
            ],
          },
          {
            id: 3,
            name: "DIGITAL TRANSFORMATION",
            teams: [
              {
                id: 1,
                name: "INTERNAL APPS",
                subTeams: [],
              },
              {
                id: 2,
                name: "DIGITAL OPERATIONS",
                subTeams: [],
              },
              {
                id: 3,
                name: "SECURITY & COMPLIANCE",
                subTeams: [],
              },
              {
                id: 4,
                name: "REVENUE  OPERATIONS",
                subTeams: [],
              },
              {
                id: 5,
                name: "INTERN",
                subTeams: [],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "IAM",
        departments: [
          {
            id: 1,
            name: "FIELD SALES",
            teams: [
              {
                id: 1,
                name: "ANZ",
                subTeams: [],
              },
              {
                id: 2,
                name: "LATAM",
                subTeams: [],
              },
              {
                id: 3,
                name: "SALES",
                subTeams: [],
              },
              {
                id: 4,
                name: "NA - EAST",
                subTeams: [],
              },
            ],
          },
          {
            id: 2,
            name: "CUSTOMER SUCCESS",
            teams: [
              {
                id: 1,
                name: "Technology Specialists",
                subTeams: [],
              },
              {
                id: 2,
                name: "IDENTITY & ACCESS MANAGEMENT",
                subTeams: [],
              },
            ],
          },
          {
            id: 3,
            name: "ENGINEERING",
            teams: [
              {
                id: 1,
                name: "IDENTITY & ACCESS MANAGEMENT",
                subTeams: [],
              },
              {
                id: 5,
                name: "INTERN",
                subTeams: [],
              },
            ],
          },
        ],
      },
    ];

    setBu(businessUnits);
  }, []);

  const BuList = (title: React.ReactNode, items: readonly BUAccessLevel[]) => (
    <Card variant="outlined" square sx={{ m: 0,p:0 }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={
          <>
            Business Units <ArrowForwardIosIcon />
          </>
        }
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
          marginLeft: "5px"
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              sx={{
                width: 200
              }}
              style={{
                ...(item.id === buId && {
                  background: "gray",
                }),
              }}
              button
              onClick={() => {
                setDeparments(item.departments ? item.departments : []);
                setBuId(item.id);
              }}
            >
              <ListItemIcon>
                <Checkbox
                  // checked={checked.indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const departmentList = (
    title: React.ReactNode,
    items: readonly DepartmentAccess[]
  ) => (
    <Card variant="outlined" square>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={
          <>
            Departments <ArrowForwardIosIcon />
          </>
        }
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              button
              onClick={() => setTeams(item.teams ? item.teams : [])}
            >
              <ListItemIcon>
                <Checkbox
                  disabled={items.length === 0}
                  // checked={checked.indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const teamList = (title: React.ReactNode, items: readonly TeamAccess[]) => (
    <Card variant="outlined" square>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            // onClick={handleToggleAll(items)}
            // checked={
            //   numberOfChecked(items) === items.length && items.length !== 0
            // }
            // indeterminate={
            //   numberOfChecked(items) !== items.length &&
            //   numberOfChecked(items) !== 0
            // }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={
          <>
            Teams <ArrowForwardIosIcon />
          </>
        }
        // subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              button
              onClick={() => setSubTeams(item.subTeams ? item.subTeams : [])}
            >
              <ListItemIcon>
                <Checkbox
                  // checked={checked.indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const subteamList = (title: React.ReactNode, items: readonly Entity[]) => (
    <Card variant="outlined" square>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            // onClick={handleToggleAll(items)}
            // checked={
            //   numberOfChecked(items) === items.length && items.length !== 0
            // }
            // indeterminate={
            //   numberOfChecked(items) !== items.length &&
            //   numberOfChecked(items) !== 0
            // }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={"Sub Teams"}
        // subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              button
              // onClick={()=>setDeparments(item.departments?item.departments:[])}
            >
              <ListItemIcon>
                <Checkbox
                  // checked={checked.indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item.name}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item sx={{ paddingLeft: "0px!important" }}>
        {BuList("Choices", bu)}
      </Grid>
      <Grid item sx={{ paddingLeft: "0px!important" }}>
        {departmentList("Choices", departments)}
      </Grid>
      <Grid item sx={{ pl: 0 }}>
        {teamList("Choices", teams)}
      </Grid>
      <Grid item sx={{ paddingLeft: "0px!important" }}>
        {subteamList("Choices", subTeams)}
      </Grid>
      <Grid item sx={{ paddingLeft: "0px!important" }}>
        <Abs />
      </Grid>
    </Grid>
  );
}
