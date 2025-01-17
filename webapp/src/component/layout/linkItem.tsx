import React from "react";
import { Theme, alpha, makeStyles } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  NavLink as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { Typography } from "@mui/material";

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(
  itemProps,
  ref
) {
  return (
    <RouterLink
      ref={ref}
      {...itemProps}
      role={undefined}
      style={({ isActive, isPending }) =>
        isActive ? { background: alpha("#FFFFF", 0.05), color: "#FF7300" } : {}
      }
    />
  );
});

const ListItemLink = (props: ListItemLinkProps) => {
  const { icon, primary, to, open, theme, isActive } = props;

  return (
    <li>
      <ListItem
        component={Link}
        to={to}
        sx={{
          height: "38px",
          borderRadius: "5px",
          paddingLeft: "15px",
          marginLeft: "8px",
          width: "calc(100% - 16px)",
          marginRight: "8px",
          marginBottom: "10px",

          "&:hover": {
            background: alpha(theme.palette.common.white, 0.05),

            ...(!open && {
              "& .menu-tooltip": {
                opacity: 1,
                visibility: "visible",
                color: "white",
                
              }
            }),
          },
          ...(isActive && {
            background: alpha(theme.palette.common.white, 0.05),
          }),
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),

          ...(open && {}),
        }}
      >
        {icon ? (
          <ListItemIcon
            sx={{
              color: "white",
              "&:hover": {
                color: "#FF7300",
              },

              ...(isActive && {
                color: "#FF7300",
              }),
            }}
          >
            {icon}
          </ListItemIcon>
        ) : null}
        <ListItemText
          sx={{
            "& .MuiListItemText-primary": {
              color: "white",
              ...(isActive && {
                color: "#FF7300",
              }),
              marginTop: "1px",
              fontSize: "16px",
            },
          }}
          primary={primary}
        />
        <span className="menu-tooltip"><Typography variant="h6" >{primary}</Typography> </span>
      </ListItem>
    </li>
  );
};

export default ListItemLink;

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  open: boolean;
  isActive: boolean;
  theme: Theme;
}
