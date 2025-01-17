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
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export default function NumberFilter(props: {
  header: Header;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  filters: Filter[];
}) {
  const [type, setType] = useState<string>("EQ");
  const [value, setValue] = React.useState<Dayjs | null>(null);


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
            type: "date",
          },
        ]);
      } else {
        var c_filters = _.cloneDeep(props.filters);

        c_filters[idx] = {
          key: props.header.id,
          value: value,
          operation: type,
          type: "date",
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

  return (
    <>
      <Stack>
        <DatePicker
          label={props.header.label}
          inputFormat="YYYY-MM-DD"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params: any) => <TextField size="small"  {...params} />}
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
              value="AFT"
              control={<Radio />}
              label="After"
            />
            <FormControlLabel
              value="AFTO"
              control={<Radio />}
              label="After or On"
            />
            <FormControlLabel
              value="BEF"
              control={<Radio />}
              label="Before"
            />
            <FormControlLabel
              value="BEFO"
              control={<Radio />}
              label="Before or On"
            />
           
            <FormControlLabel
              value="EQ"
              control={<Radio />}
              label="Equals"
            />
              <FormControlLabel
              value="DNEQ"
              control={<Radio />}
              label="Does not Equals"
            />
          </RadioGroup>
        </MenuItem>
        {/* <MenuItem onClick={() => setValue(null)}>Clear</MenuItem>
        <MenuItem onClick={handleClose}>Clear All</MenuItem> */}
      </Menu>
    </>
  );
}
