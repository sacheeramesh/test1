import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from "@mui/material";

import { FilterAlt } from "@mui/icons-material";
import { Filter, Header } from "./customTable";
import _ from "lodash";

export default function NumberFilter(props: {
  header: Header;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  filters: Filter[];
}) {
  const [type, setType] = useState<string>("CON");
  const [value, setValue] = useState<string>("");


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    
      var idx = props.filters.findIndex((val) => val.key === props.header.id);

    if (idx !== -1) {
      var operation = props.filters[idx].operation;
      setValue(props.filters[idx].value)
      setType( operation? operation :"")
      } 
  }, []);

  useEffect(() => {
    if (value) {
      var idx = props.filters.findIndex((val) => val.key === props.header.id);

      if (idx === -1) {
        props.setFilters((prevState) => [
          ...prevState,
          {
            key: props.header.id,
            value: value,
            operation: type,
            type: "string",
          },
        ]);
      } else {
        var c_filters = _.cloneDeep(props.filters);

        c_filters[idx] = {
          key: props.header.id,
          value: value,
          operation: type,
          type: "string",
        };

        props.setFilters(c_filters);
      }
    } else {
      props.setFilters((prevState) =>
        prevState.filter((filter) => filter.key !== props.header.id)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, type]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    (event.target as HTMLInputElement).value
      ? setValue((event.target as HTMLInputElement).value)
      : setValue("");
  };

  return (
    <>
      <Stack>
        <TextField
          size="small"
          disabled = {type ==='EMTY' || type ==='DEMTY'}
          id="outlined-basic"
          value={ value}
          label={props.header.label}
          variant="outlined"
          onChange={handleTextChange}
        />
      </Stack>
      <IconButton onClick={handleClick}>
        <FilterAlt />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem disableRipple>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={type}
            name="radio-buttons-group"
            onChange={handleChange}
          >
            <FormControlLabel
              value="CON"
              control={<Radio />}
              label="Contains"
            />
            <FormControlLabel
              value="DNCON"
              control={<Radio />}
              label="Does not contain"
            />
            <FormControlLabel
              value="EQ"
              control={<Radio />}
              label="Equals"
            />
            <FormControlLabel
              value="DNEQ"
              control={<Radio />}
              label="Does not equal"
            />
            <FormControlLabel
              value="EMTY"
              control={<Radio />}
              label="Empty"
            />
            <FormControlLabel
              value="DEMTY"
              control={<Radio />}
              label="Not empty"
            />
            <FormControlLabel
              value="SW"
              control={<Radio />}
              label="Starts with"
            />
             <FormControlLabel
              value="EW"
              control={<Radio />}
              label="Ends with"
            />
          </RadioGroup>
        </MenuItem>
      </Menu>
    </>
  );
}
