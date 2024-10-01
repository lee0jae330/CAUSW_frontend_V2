import { AxiosResponse } from "axios";

import { API, useUserStore } from "@/shared";

export const UserService = () => {
  const URI = "/api/v1/users";

  const setUserStore = useUserStore((state) => state.setUserStore);

  const getMe = async () => {
    const { data } = (await API.get(`${URI}/me`)) as AxiosResponse<User.User>;

    setUserStore(data);
  };

  const getUserInfo = async () => {
    const response = await API.get(`${URI}/me`);  // 서버로부터 유저 정보를 가져옴
    return response;
  }
  


  const checkCurrentAcademicRecord = async () => {
    try {
      const response = (await API.get(`${URI}/academic-record/current/not-accepted`)) as AxiosResponse;
      return response;
    }
    catch(error)
    {
      throw error;
    }
  }
  

  return { getMe, getUserInfo, checkCurrentAcademicRecord };
};
