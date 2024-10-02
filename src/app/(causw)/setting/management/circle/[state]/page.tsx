import { SettingRscService } from "@/shared";

import { Management } from "@/widget";

const CircleManagement = async ({
  params: { state },
}: {
  params: { state: string };
}) => {
  const { getByState, getAllAdmissions } = SettingRscService();

  /* const data = isAddmission
    ? await getAllAdmissions(null, 0)
    : await getByState(state.toUpperCase() as User.UserDto["state"], null, 0); */

  const headers = [
    { label: "이름", key: "userName" },
    { label: "학번", key: "studentId" },
  ];

  const data = [
    { userName: "강민규", studentId: "20203128", id: "1" },
    { userName: "윤민규", studentId: "20203128", id: "2" },
  ];

  return (
    <>
      <Management
        state={state}
        title="동아리원 관리"
        firstNavigation={{
          name: "동아리원 목록",
          state: "member",
          exportType: "CIRCLE_MEMBERS",
        }}
        navigation={[
          {
            name: "동아리 신청 유저 목록",
            state: "apply",
            exportType: "CIRCLE_APPLY_USERS",
          },
        ]}
        data={data}
      />
    </>
  );
};

export default CircleManagement;
