import axios from "axios";

import {
  BASEURL,
  noAccessTokenCode,
  noPermissionCode,
  noRefreshTokenCode,
  AuthRscService,
} from "@/shared";

export const API = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const storageRefreshKey = "CAUCSE_JWT_REFRESH";

export const setRccToken = (access: string, refresh: string | false) => {
  API.defaults.headers["Authorization"] = access;
  if (refresh) localStorage.setItem(storageRefreshKey, refresh);
};

export const removeRccAccess = (): unknown =>
  delete API.defaults.headers["Authorization"];

export const getRccAccess = (): string =>
  `${API.defaults.headers["Authorization"]}`;

export const removeRccRefresh = (): void => {
  localStorage.removeItem(storageRefreshKey);
};

export const getRccRefresh = (): string | null => {
  return localStorage.getItem(storageRefreshKey);
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { updateAccess, signout } = AuthRscService();
    if (error.response) {
      const {
        response: {
          data: { errorCode },
        },
        config,
      } = error;

      //Access token 재발급 과정
      if (noAccessTokenCode.includes(errorCode)) {
        const refresh = getRccRefresh();
        if (!refresh) {
          location.href = "auth/signin";
        } else {
          const accessToken = await updateAccess(refresh);
          config.headers["Authorization"] = accessToken;
          return API.request(config);
        }
      } else if (noPermissionCode.includes(error.message))
        location.href = "/no-permission";
      else if (noRefreshTokenCode.includes(error.message)) {
        signout();
      }
    }
    throw new Error(`${error}`);
  }
);
