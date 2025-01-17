// Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 Inc. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { BasicUserInfo, DecodedIDTokenPayload } from "@asgardeo/auth-spa";

export type PromotionCycleStatus = "OPEN" | "CLOSED" | "END";

export type ApplicationAction = "REQUEST" | "SUBMIT" | "SAVE" | "DECLINE";
export type PromotionRequestType =
  | "NORMAL"
  | "SPECIAL"
  | "TIME_BASED"
  | "INDIVIDUAL_CONTRIBUTOR";

export enum PromotionType {
  NORMAL = "NORMAL",
  SPECIAL = "SPECIAL",
  TIME_BASED = "TIME_BASED",
  INDIVIDUAL_CONTRIBUTOR = "INDIVIDUAL_CONTRIBUTOR",
}

export type AlertType =
  | "REQUEST"
  | "SUBMIT"
  | "SAVE"
  | "DECLINE"
  | "END"
  | "CREATE";

export type stateType = "failed" | "success" | "loading" | "idle";

export enum ApplicationState {
  REQUESTED = "REQUESTED",
  ACTIVE = "ACTIVE",
  SUBMITTED = "SUBMITTED",
  DRAFT = "DRAFT",
  DECLINED = "DECLINED",
  WITHDRAW = "WITHDRAW",
  REMOVED = "REMOVED",
  FL_APPROVED = "FL_APPROVED",
  APPROVED = "APPROVED",
  FL_REJECTED = "FL_REJECTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  PROCESSING = "PROCESSING",
}

export enum RecommendationState {
  REQUESTED = "REQUESTED",
  SUBMITTED = "SUBMITTED",
  DECLINED = "DECLINED",
  EXPIRED = "EXPIRED",
}

export enum Role {
  HR_ADMIN = "HR_ADMIN",
  PROMOTION_BOARD_MEMBER = "PROMOTION_BOARD_MEMBER",
  FUNCTIONAL_LEAD = "FUNCTIONAL_LEAD",
  EMPLOYEE = "EMPLOYEE",
  LEAD = "LEAD",
}

export enum SyncState {
  IDLE = "IDLE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  IN_PROGRESS = "IN_PROGRESS",
}

interface EligibilityInterface {
  eligible: boolean;
  message: string;
}

export interface EmployeeInfo {
  employeeThumbnail: string;
  reportingLead: string;
  reportingLeadThumbnail: string;
  workEmail: string;
  startDate: string;
  joinedBusinessUnit: string;
  joinedDepartment: string;
  joinedTeam: string;
  joinedLocation: string;
  lastPromotedDate: string | null;
}

interface SpecialPromotionRequest {
  currentJobBand: string;
  employeeEmail: string;
  id: number;
  nextJobBand: number;
  promotionCycle: string;
  promotionStatement: string;
  backupPromotionStatement: string;
  recommendations: RecommendationInterface[];
  status: ApplicationState;
}

export interface PromotionRequest {
  currentJobBand: number;
  employeeEmail: string;
  employeeImageUrl: string;
  id: number;
  promotionType: PromotionRequestType;
  nextJobBand: number;
  promotionCycle: string;
  promotionStatement: string;
  backupPromotionStatement: string;
  recommendations: RecommendationInterface[];
  status: ApplicationState;

  reasonForRejection: string;

  businessUnit: string;
  department: string;
  team: string;
  subTeam: string;
  joinDate: string;
  lastPromotedDate: string;
  location: string;
  currentJobRole: string;

  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  isNotificationEmailSent: boolean;
}

export interface RecommendationInterface {
  promotionCycleId: string;
  promotionCycle: string;
  employeeName: string;
  employeeEmail: string;
  recommendationStatement: string | null;
  recommendationAdditionalComment: string | null;
  promotingJobBand: number;
  promotionType: string;
  promotionRequestStatus: ApplicationState;
  reasonForRejection: string | null;
  currentJobBand: number;
  leadEmail: string;
  recommendationID: number;
  recommendationStatus: RecommendationState;
  reportingLead: boolean;
  isSample: boolean;
}

export interface ApplicationsState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  activeCycleId: string | null;
  requests: PromotionRequest[] | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

export type AuthFlowState =
  | "start"
  | "l_choreo_tokens"
  | "e_choreo_tokens"
  | "l_user_privileges"
  | "e_user_privileges"
  | "end";

export interface AuthState {
  status: "failed" | "loading" | "idle" | "success";
  mode: "active" | "maintenance";
  statusMessage: string | null;
  isAuthenticated: boolean;
  userInfo: BasicUserInfo | null;
  idToken: string | null;
  isIdTokenExpired: boolean | null;
  decodedIdToken: DecodedIDTokenPayload | null;
  roles: Role[];
  choreoTokens: ChoreoTokens | null;
  userPrivileges: number[] | null;
  errorMessage: string | null;
  authFlowState: AuthFlowState;
}

export interface ChoreoTokens {
  state: "loading" | "success" | "error";
  access_token: string;
  refresh_token: string;
}

export interface AuthData {
  userInfo: BasicUserInfo;
  idToken: string;
  decodedIdToken: DecodedIDTokenPayload;
}

export interface ChoreoConfig {
  tokenEndPoint: string;
  revokeEndPoint: string;
  clientId: string;
  clientSecret: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: Number;
  id_token: string;
  issued_token_type: string;
  scope: string;
  refresh_token: string;
  token_type: string;
}

export interface Employee {
  workEmail: string;
  firstName: string;
  lastName: string;
  jobBand: number;
  employeeThumbnail: string;
}

export interface SpecialPromotionState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  activePromotionCycle: ActivePromotionCycleInterface | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

export interface PromotionState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  promotionRequests: PromotionRequest[] | null;
  activePromotionCycle: ActivePromotionCycleInterface | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
  users: User[];
  currentEditId: number | null;
}

export interface NotificationHubState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
  processingList: number[];
  doneList: number[];
  failedList: number[];
}

export interface PromotionCycleManageState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;

  stat_state: "failed" | "success" | "loading" | "idle";
  stat_stateMessage: string | null;

  errorMessage: string | null;
  promotionRequests: PromotionRequest[] | null;
  activePromotionCycle: ActivePromotionCycleInterface | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
  users: User[];
  currentEditId: number | null;
}

export interface SubmittedPromotionRequestState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;
  errorMessage: string | null;
  requests: PromotionRequest[] | null;
  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

export interface ActivePromotionCycleInterface {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: PromotionCycleStatus;
}

interface ActivePromotionInterface {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  request: PromotionRequest | null;
}

export interface Entity {
  id: number;
  name: string;
}

export interface TeamAccess extends Entity {
  subTeams?: Entity[];
}
export interface DepartmentAccess extends Entity {
  teams?: TeamAccess[];
}
export interface BUAccessLevel extends Entity {
  departments?: DepartmentAccess[];
}

export interface UserInsertInterface {
  email: string;
  roles: Role[];
  functionalLeadAccessLevels?: {
    businessUnits: BUAccessLevel[];
  } | null;
}

export interface UpdateUser {
  id: number;
  email?: string;
  roles?: Role[];
  functionalLeadAccessLevels?: {
    businessUnits: BUAccessLevel[];
  } | null;
  active?: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  jobBand?: number;
  email: string;
  roles: Role[];
  businessUnit: boolean;
  employeeThumbnail: string;
  functionalLeadAccessLevels: {
    businessUnits: BUAccessLevel[];
  } | null;
  active: boolean;
}

export interface UserTransferInterface {
  id: number;
  firstName: string;
  lastName: string;
  jobBand?: number;
  email: string;
  roles: Role[];
  businessUnit: boolean;
  functionalLeadAccessLevels: {
    businessUnits: BUAccessLevel[];
  };
  active: boolean;
}

export interface UsersState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;

  syncState: SyncState;
  syncStateMessage: string | null;

  errorMessage: string | null;

  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;

  currentEditUser: User | null;

  users: User[];
  businessUnits: BUAccessLevel[];

  currentEditId: number | null;
  isOpenInsertDialog: boolean;
}

export interface CommonEmployeesState {
  state: "failed" | "success" | "loading" | "idle";
  stateMessage: string | null;

  employees: Employee[];

  backgroundProcess: boolean;
  backgroundProcessMessage: string | null;
}

export interface Header {
  title: string;
  size: number;
  align: "left" | "right" | "center";
}
