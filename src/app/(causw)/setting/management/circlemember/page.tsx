import { UserRscService } from "@/shared";

import { Management } from "@/widget";

const CircleMemberManagement = async ({
  params: { state },
}: {
  params: { state: string };
}) => {
  const { findByState, findAllAdmissions } = UserRscService();

  /* const data = isAddmission
    ? await findAllAdmissions(null, 0)
    : await findByState(state.toUpperCase() as User.UserDto["state"], null, 0); */

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
        firstNavigation={{ name: "동아리원 목록", state: "" }}
        data={data}
        headers={headers}
      />
    </>
  );
};

export default CircleMemberManagement;
