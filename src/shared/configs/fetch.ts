"use server";

import { cookies } from "next/headers";

const storageAccessKey = "CAUCSE_JWT_ACCESS";
const storageRefreshKey = "CAUCSE_JWT_REFRESH";

export const setRscToken = (access: string, refresh: string | false) => {
  cookies().set(storageAccessKey, access);
  if (refresh) cookies().set(storageRefreshKey, refresh);
};

export const removeRscAccess = () => {
  cookies().delete(storageAccessKey);
};

export const getRscAccess = async () => {
  const token = cookies().get(storageAccessKey)?.value;
  return Promise.resolve(token);
};

export const setRscHeader = async (): Promise<{
  Authorization: string;
}> => {
  const token = await getRscAccess();

  if (token) {
    return {
      Authorization: token,
    };
  }

  return { Authorization: "" };
};

export const removeRscRefresh = () => {
  cookies().delete(storageRefreshKey);
};

export const getRscRefresh = async () => {
  const token = cookies().get(storageRefreshKey)?.value;
  return Promise.resolve(token);
};
