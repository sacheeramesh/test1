import React, {
  Dispatch,
  SetStateAction,
  useEffect,
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
  TextField,
} from "@mui/material";

import { FilterAlt } from "@mui/icons-material";
import { Filter, Header } from "./customTable";
import _ from "lodash";

export default function NumberFilter(props: {
  header: Header;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  filters: Filter[];
}) {
  const [type, setType] = useState<string>("EQ");
  const [value, setValue] = useState<number|null>(null);

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
      setValue(props.filters[idx].value);
      setType(operation ? operation : "");
    }
  }, [props]);

  useEffect(() => {
    if (value) {
      var idx = props.filters.findIndex((val) => val.key === props.header.id);

      if (idx === -1) {
        props.setFilters((prevState) => [
          ...prevState,
          {
            key: props.header.id,
            value: Number(value),
            operation: type,
            type: "number",
          },
        ]);
      } else {
        var c_filters = _.cloneDeep(props.filters);

        c_filters[idx] = {
          key: props.header.id,
          value: Number(value),
          operation: type,
          type: "number",
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
      ? setValue(Number((event.target as HTMLInputElement).value))
      : setValue(null);
  };
  return (
    <>
      <Stack>
        <TextField
          size="small"
          id="outlined-basic"
          value={value}
          label={props.header.label}
          variant="outlined"
          type="number"
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
            <FormControlLabel value="EQ" control={<Radio />} label="Equals" />
            <FormControlLabel
              value="DNEQ"
              control={<Radio />}
              label="Does not equal"
            />
            <FormControlLabel
              value="GT"
              control={<Radio />}
              label="Greater than"
            />
            <FormControlLabel
              value="GTE"
              control={<Radio />}
              label="Greater than or equal"
            />
            <FormControlLabel
              value="LT"
              control={<Radio />}
              label="Less than"
            />
            <FormControlLabel
              value="LTE"
              control={<Radio />}
              label="Less than or equal"
            />
          </RadioGroup>
        </MenuItem>
        {/* <MenuItem onClick={() => setValue(undefined)}>Clear</MenuItem>
        <MenuItem onClick={handleClose}>Clear All</MenuItem> */}
      </Menu>
    </>
  );
}
