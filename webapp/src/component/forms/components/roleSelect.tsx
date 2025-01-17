import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Role } from "@utils/types";

import { Face } from "@mui/icons-material";
import {
  FormControl,
  OutlinedInput,
} from "@mui/material";

export default function RolesSelection(props: {
  setValue: (value: Role[]) => void;
  data?: Role[];
}) {
  const theme = useTheme();
  const [role, setRole] = React.useState<Role[]>([]);

  React.useEffect(() => {
    if (props.data) { 
      setRole(props.data)
    }
  }, [props.data]);

  const handleChange = (event: SelectChangeEvent<typeof role>) => {
    const {
      target: { value },
    } = event;
    setRole(typeof value === "string" ? [] : value);
    props.setValue(typeof value === "string" ? [] : value);
  };

  return (
    <FormControl fullWidth>
      <Select
        multiple
        sx={{ marginTop: "10px" }}
        value={role}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" />}
        renderValue={(selected) => {
          return (
            selected && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    icon={<Face />}
                    key={value}
                    style={{ background: getColor(value) }}
                    label={value}
                  />
                ))}
              </Box>
            )
          );
        }}
        MenuProps={MenuProps}
      >
        {roles.map((role) => (
          <MenuItem
            key={role}
            value={role}
            style={getStyles(role, roles, theme)}
          >
            {role}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const roles: Role[] = [
  Role.HR_ADMIN,
  Role.FUNCTIONAL_LEAD,
  Role.LEAD,
  Role.PROMOTION_BOARD_MEMBER,
];

const getColor = (role: Role) => {
  if (role === Role.HR_ADMIN) {
    return "#FF5630";
  } else if (role === Role.FUNCTIONAL_LEAD) {
    return "#FFAB00";
  } else if (role === Role.LEAD) {
    return "#36B37E";
  } else if (role === Role.PROMOTION_BOARD_MEMBER) {
    return "#ababab";
  } else if (role === Role.EMPLOYEE) {
    return "#00875A";
  } else {
    return "#0052CC";
  }
};

function getStyles(role: Role, roles: readonly Role[], theme: Theme) {
  return {
    fontWeight:
      roles.indexOf(role) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
