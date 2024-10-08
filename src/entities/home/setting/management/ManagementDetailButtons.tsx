"use client";

import { Button } from "@/shared";
import { ManagementState } from "@/widget";
import { uiEntities } from "./AdmissionManagementDetailEntities";
import { useState } from "react";
import { WarningModal } from "./WarningModal";
import { Modal } from "@/shared";






export function AdmissionManagementDetailButtons({
  state,
  admission,
}: {
  state: ManagementState;
  admission: Setting.GetAdmissionResponseDto;
}) {
  const buttons = uiEntities[state].buttons;
  const [ isModalOpen, setIsModalOpen ] = useState('');
  const showWarningModal = (name: string) => {

    if (name === "목록에서 삭제"){
      setIsModalOpen("DELETE");
    }
    if (name === "추방"){
      setIsModalOpen("EXPEL");
    }
  }

  return (
    <div className="flex gap-[20px] lg:gap-[50px]">
      {buttons.map(({ name, action, variant }) => (
        <Button
          key={name}
          action={() => {
            if (name === "목록에서 삭제")
 {             setIsModalOpen("DELETE");}
            else if (name === "추방")
{               setIsModalOpen("EXPEL");}    
            else if (name === "거부")
{               setIsModalOpen("REJECT");}    
            else
{            action(admission);}
          }}
          goBack
          variant={variant}
          className="h-[55px] w-[150px] lg:w-[300px]"
        >
          {name}
        </Button>
      ))}
      {isModalOpen !== "" &&(<WarningModal isOpen={true} onClose= {() => {setIsModalOpen('')}} admission = {admission} type = {isModalOpen}></WarningModal>)}
    </div>
  );
}
