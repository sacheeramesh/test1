// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { RouteObject, NonIndexRouteObject } from "react-router-dom";
import { View } from "./view/index";
import React from "react";
import { isIncludedRole } from "./utils/utils";

// icons
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ConstructionIcon from "@mui/icons-material/Construction";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssistantIcon from "@mui/icons-material/Assistant";

import { Role } from "@utils/types";

export interface RouteObjectWithRole extends NonIndexRouteObject {
  allowRoles: Role[];
  icon:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  text: string;
  children?: RouteObjectWithRole[];
  bottomNav?: boolean;
}

interface RouteDetail {
  path: string;
  allowRoles: Role[];
  icon:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  text: string;
  bottomNav?: boolean;
}

export const routes: RouteObjectWithRole[] = [
  {
    path: "",
    text: "Promotion History",
    icon: React.createElement(AccountCircleIcon),
    element: React.createElement(View.Dashboard),
    allowRoles: [Role.EMPLOYEE],
  },
  {
    path: "/individual-contributors-promotion",
    text: "Individual Contributors Promotion",
    icon: React.createElement(AssistantIcon),
    element: React.createElement(View.SpecialPromotion),
    allowRoles: [Role.LEAD],
  },
  {
    path: "/time-based-promotions",
    text: "Time Based Promotions",
    icon: React.createElement(SupervisedUserCircleIcon),
    element: React.createElement(View.LeadView),
    allowRoles: [Role.LEAD],
  },
  {
    path: "/functional-lead",
    text: "Functional Lead Portal",
    icon: React.createElement(GroupsIcon),
    element: React.createElement(View.FunctionalLead),
    allowRoles: [Role.FUNCTIONAL_LEAD],
  },
  {
    path: "/promotion-board",
    text: "Promotion Board Portal",
    icon: React.createElement(AdminPanelSettingsIcon),
    element: React.createElement(View.PromotionBoard),
    allowRoles: [Role.PROMOTION_BOARD_MEMBER],
  },
  {
    path: "/administration",
    text: "Admin Portal ",
    icon: React.createElement(ConstructionIcon),
    element: React.createElement(View.Administration),
    allowRoles: [Role.HR_ADMIN],
  },
  // Temporarily disabled due to customer requirement.
  // {
  //   path: "/standard-based-promotions",
  //   text: "Standard Based Promotions",
  //   icon: React.createElement(Diversity1Icon),
  //   element: React.createElement(View.StandardPromotion),
  //   allowRoles: [Role.HR_ADMIN],
  // },
  {
    path: "/help",
    text: "help",
    icon: React.createElement(ConstructionIcon),
    element: React.createElement(View.Help),
    allowRoles: [Role.EMPLOYEE],
    bottomNav: true,
  },
];

export const getActiveRoutesV2 = (
  routes: RouteObjectWithRole[] | undefined,
  roles: Role[]
): RouteObjectWithRole[] => {
  if (!routes) return [];
  var routesObj: RouteObjectWithRole[] = [];
  routes.forEach((routeObj) => {
    if (isIncludedRole(roles, routeObj.allowRoles)) {
      routesObj.push({
        ...routeObj,
        children: getActiveRoutesV2(routeObj.children, roles),
      });
    }
  });

  return routesObj;
};

export const getActiveRoutes = (roles: Role[]): RouteObject[] => {
  var routesObj: RouteObject[] = [];
  routes.forEach((routeObj) => {
    if (isIncludedRole(roles, routeObj.allowRoles)) {
      routesObj.push({
        ...routeObj,
      });
    }
  });
  return routesObj;
};

export const getActiveRouteDetails = (roles: Role[]): RouteDetail[] => {
  var routesObj: RouteDetail[] = [];
  routes.forEach((routeObj) => {
    if (isIncludedRole(roles, routeObj.allowRoles)) {
      routesObj.push({
        path: routeObj.path ? routeObj.path : "",
        ...routeObj,
      });
    }
  });
  return routesObj;
};
