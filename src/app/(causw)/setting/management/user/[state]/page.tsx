import { SettingRscService } from "@/shared";
import { Management } from "@/widget";

const navigation: {
  name: string;
  state: string;
  router: string;
  exportType?: Setting.ExportType;
}[] = [
  {
    name: "가입 거부 유저",
    state: "drop",
    exportType: "DROP_USERS",
    router: "/setting/management/user/TODO",
  },
  {
    name: "활성 유저",
    state: "active",
    exportType: "ACTIVE_USERS",
    router: "/setting/management/user/TODO",
  },
  {
    name: "추방 유저",
    state: "inactive_n_drop",
    exportType: "INACTIVE_N_DROP_USERS",
    router: "/setting/management/user/TODO",
  },
  {
    name: "탈퇴 유저",
    state: "inactive",
    exportType: "INACTIVE_USERS",
    router: "/setting/management/user/TODO",
  },
];

const UserManagement = async ({
  params: { state },
}: {
  params: { state: string };
}) => {
  const { getByState, getAllAdmissions } = SettingRscService();

  const nowNavigation = navigation.find((element) => element.state === state);

  const data = nowNavigation
    ? await getByState(
        nowNavigation
          .exportType!.replace("_USERS", "")
          .trim() as User.UserDto["state"],
        null,
        0,
      ).then((res) =>
        res.map((element) => ({ ...element, userName: element.name })),
      )
    : await getAllAdmissions(null, 0);

  return (
    <Management
      state={state}
      title="유저 관리"
      firstNavigation={{
        name: "가입 대기 유저",
        state: "admission",
        exportType: "ADMISSION_USERS",
        router: "/setting/management/user/TODO",
      }}
      navigation={navigation}
      data={data.map((element) => ({
        userName: element.userName,
        studentId: element.studentId,
        id: element.id,
      }))}
    />
  );
};

export default UserManagement;
