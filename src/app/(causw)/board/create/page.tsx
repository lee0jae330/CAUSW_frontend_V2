"use client";

import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { Modal, PreviousButton } from "@/shared";

import { useState } from "react";

/**
 * TODO : Submit 버튼에 api post하기
 */

interface IFormInput {
  boardName: string;
}

interface ICreateBoardForm {
  register: UseFormRegister<IFormInput>;
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  onSubmit: SubmitHandler<IFormInput>;
  errors: FieldErrors<IFormInput>;
}

const CreateBoardForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
}: ICreateBoardForm) => (
  <div className="flex h-full w-full flex-col items-center">
    <div className="h-2/5"></div>
    <h1 className="px-10 pb-10 text-center text-lg md:px-0">
      생성하고자 하는 게시판의 이름을 알려주세요 !
    </h1>
    <form
      className="md:px-15 flex h-full w-full flex-col items-center px-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="h-12 w-full rounded-3xl border border-black px-4 text-center"
        type="text"
        {...register("boardName", { required: true })}
        id="boardName"
        placeholder="이름 입력하기 !"
      />
      {errors.boardName && (
        <p className="pt-5 text-red-500">게시판 이름을 입력해주세요 !</p>
      )}
      <div className="bottom-0 right-0 m-4 md:absolute">
        <button
          className="w-36 rounded-3xl bg-red-500 px-6 py-3 font-bold text-white md:bottom-10"
          type="submit"
        >
          확인
        </button>
      </div>
    </form>
  </div>
);

const ModalContent = () => (
  <div className="flex flex-col items-center">
    <h1 className="pb-10 text-lg font-bold md:text-xl">
      이미 존재하는 게시판 이름
    </h1>
    <p className="text-center">동일한 이름의 게시판이 이미 존재합니다.</p>
    <p className="pb-10 text-center">다른 이름을 입력해주세요</p>
  </div>
);

const CreateBoard = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    reset();
    const result = true; //api 호출 결과
    if (result) {
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="absolute bottom-0 top-0 flex w-full flex-col items-center justify-items-center overflow-y-auto bg-boardPageBackground p-6 scrollbar-hide">
      <PreviousButton />
      <CreateBoardForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
      />

      {showModal && (
        <Modal closeModal={closeModal}>
          <ModalContent />
        </Modal>
      )}
    </div>
  );
};

export default CreateBoard;
