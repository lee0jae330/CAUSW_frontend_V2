import { AxiosResponse } from "axios";

import { API, useUserStore } from "@/shared";

export const UserService = () => {
  const URI = "/api/v1/users";

  const setUserStore = useUserStore((state) => state.setUserStore);

  const getUserInfo = async () => {
    const { data } = (await API.get(
      `${URI}/me`
    )) as AxiosResponse<User.UserDto>;

    setUserStore(data);
  };

  const getUserInfoRevised = async () => {
    const response = await API.get(`${URI}/me`);  // 서버로부터 유저 정보를 가져옴
    return response;
  }
  
  const updateUserInfo = async (data: any) => {
    try{
      const response = (await API.put(`${URI}`, data)) as AxiosResponse;
      console.log(response);
      return response;
    }
    catch(error)
    {
      throw error;
    }
    
  }

  const updateUserAcademicInfo = async (data: any) => {
    try
  {  const response = (await API.put(`${URI}/academic-record/update`, data)) as AxiosResponse;
    return response;
  } catch(error)
  {
    throw error;
  }  
  }

  return { getUserInfo, getUserInfoRevised, updateUserInfo, updateUserAcademicInfo };
};
