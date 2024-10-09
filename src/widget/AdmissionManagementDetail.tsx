import {
  ManagementDetailButtons,
  managementDetailEntities,
  ManagementDetailInfoTable,
} from "@/entities/home/setting/management";
import {
  convertAdmissionDataToTableEntity,
  convertUserDataToTableEntity,
  titleMapping,
  titleMappingForRejected,
} from "@/entities/home/setting/management/AdmissionManagementDetailEntities";
import { SettingRscService } from "@/shared";
import { ManagementState } from "./Management";
import { UserRscService } from "@/shared";

interface ManagementDetailProp {
  state: ManagementState;
  admissionId: string;
}

export async function ManagementDetail({
  state,
  admissionId,
}: ManagementDetailProp) {
  const entities = managementDetailEntities[state];
  const { titleSuffix } = entities;
  const { getAdmission } = SettingRscService();
  const { getUser } = UserRscService();
  let admission;

  if (state === "admission" || state === "reject")
    {
      try {
        admission = await getAdmission(admissionId);
      } catch(error) {
        console.error("가입 신청서 조회 실패");
        console.log(error);
      }
  }
  let userInfo;
  try {
    userInfo = await getUser(admissionId);
    console.log(userInfo);
  }
  catch(error){
    console.log('유저 정보 조회 실패',error);
  }

  let name;
  let studentId;
  // 가입 신청서 조회도 안되고 유저 정보 조회도 안 될 경우에
  if (!admission && !userInfo) return <div>가입 신청서 조회 실패</div>;
  if (admission && !userInfo){
    name = admission.user.name;
    studentId = admission.user.studentId;
  }
  else if (!admission && userInfo){
    name = userInfo.name;
    studentId = userInfo.studentId;
  }

  return (
    <div className="flex w-full flex-col items-center gap-[30px] px-2 py-4">
      <p className="text-[18px] font-semibold lg:text-[40px] mt-8 mb-8">{`${name}(${studentId})의 ${titleSuffix}`}</p>
{admission && (<><ManagementDetailInfoTable
        data={convertAdmissionDataToTableEntity(admission)}
        titleMapping={titleMapping}
      />
      <ManagementDetailButtons state={state} admission={admission} />
      </>)}
{(userInfo  && (state === "drop" || state === "inactive")) && (<>
   <ManagementDetailInfoTable
        data={convertUserDataToTableEntity(userInfo)}
        titleMapping={titleMappingForRejected}
      />
    <ManagementDetailButtons state={state} admission={userInfo} />
   </> )}
   {(userInfo  && (state === "active" || state === "reject")) &&(<div>
   <ManagementDetailInfoTable
        data={convertUserDataToTableEntity(userInfo)}
        titleMapping={titleMapping}
      />
    <ManagementDetailButtons state={state} admission={userInfo} />
   </div> )}
    </div>
  );
}
