// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import axios from "axios";
import qs from "qs";
import { ChoreoTokens } from "./types";
import { ChoreoAppConfig, AppConfig } from "../config/config";
import { APIService } from "./apiService";

// TODO : need to do proper error handling
export const getAPIToken = (idToken: string | null) => {
  let config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let data = {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    requested_token_type: "urn:ietf:params:oauth:token-type:jwt",
    subject_token: idToken,
    client_id: ChoreoAppConfig.clientId,
    client_secret: ChoreoAppConfig.clientSecret,
  };

  return new Promise<ChoreoTokens>((resolve, reject) => {
    axios.post(ChoreoAppConfig.tokenEndPoint, qs.stringify(data), config).then(
      (res) => {
        if (res.status === 200) {
          var token: ChoreoTokens = res.data;
          resolve(token);
        }
        reject("error");
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const revokeAPIToken = (token: string) => {
  let config = {
    headers: {
      Authorization:
        "Basic " +
        btoa(`${ChoreoAppConfig.clientId}:${ChoreoAppConfig.clientSecret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let data = {
    token: token,
  };

  return new Promise((resolve, reject) => {
    axios.post(ChoreoAppConfig.revokeEndPoint, qs.stringify(data), config).then(
      (res) => {
        resolve("successfully revoked");
      },
      (error) => {
        reject("error");
      }
    );
  });
};

// TODO : need to do proper error handling
export const getUserPrivileges = () => {
  return new Promise<number[]>((resolve, reject) => {
    APIService.getInstance()
      .get(AppConfig.serviceUrls.employeeInfoEndPoint)
      .then(
        (res) => {
          var privileges: number[] = res.data.privileges;
          resolve(privileges);
        },
        (error) => {
          reject("error");
        }
      );
  });
};
