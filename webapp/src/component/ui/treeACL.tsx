import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { BUAccessLevel } from "@utils/types";
import { capitalizedFLWords } from "@utils/utils";

export default function ControlledTreeView(props: { data: BUAccessLevel[] }) {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? getAllList() : []
    );
  };

  const getAllList = () => { 
    var all_node_ids: string[] = [];
    
    props.data.forEach(bu => { 
      all_node_ids.push(bu.id.toString());
      bu.departments && bu.departments.forEach(department => { 
        all_node_ids.push(bu.id.toString()+"-"+department.id.toString());
        department.teams && department.teams.forEach(team => { 
          all_node_ids.push(bu.id.toString()+"-"+department.id.toString()+"-"+team.id.toString());
        })
      })
    })

    return all_node_ids;
  }

  return (
    <Box sx={{ height: 350, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
      </Box>
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
      >
        {props.data.map((buAccesslevel) => {
          return (
            <TreeItem
              nodeId={buAccesslevel.id.toString()}
              label={buAccesslevel.name}
            >
              {buAccesslevel.departments &&
                buAccesslevel.departments.map((department) => {
                  return (
                    <TreeItem
                      nodeId={
                        buAccesslevel.id.toString() +
                        "-" +
                        department.id.toString()
                      }
                      label={capitalizedFLWords(department.name)}
                    >
                      {department.teams &&
                        department.teams.map((team) => {
                          return (
                            <TreeItem
                              nodeId={
                                buAccesslevel.id.toString() +
                                "-" +
                                department.id.toString() +
                                "-" +
                                team.id.toString()
                              }
                              label={capitalizedFLWords(team.name)}
                            ></TreeItem>
                          );
                        })}
                    </TreeItem>
                  );
                })}
            </TreeItem>
          );
        })}
      </TreeView>
    </Box>
  );
}
