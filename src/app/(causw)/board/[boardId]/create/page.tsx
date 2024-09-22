"use client";

import {
  CreatePostFooter,
  FilePreview,
  PostForm,
  VotingForm,
} from "@/entities";
import { CustomCheckBox, Question } from "@/entities";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  PostRscService,
  PreviousButton,
  useCreatePostStore,
  useCreateVoteStore,
  useFileUpload,
} from "@/shared";
import React, { useEffect, useState } from "react";

import { STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR } from "next/dist/lib/constants";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @next/next/no-async-client-component
const CreatePostPage = (props: any) => {
  const boardId = props.params.boardId;
  const { createPost } = PostRscService();

  const {
    title,
    content,
    isAnonymous,
    isQuestion,
    setContent,
    setTitle,
    toggleAnonymous,
    toggleQuestion,
    clearPost,
  } = useCreatePostStore();

  const {
    isVote,
    voteTitle,
    options,
    isMultipleChoice,
    allowAnonymous,
    toggleVote,
    setVoteTitle,
    setVoteOption,
    addVoteOption,
    removeVoteOption,
    toggleMultipleChoice,
    toggleAllowAnonymous,
    submitVote,
  } = useCreateVoteStore();
  const { selectedFiles, resetFiles } = useFileUpload();
  const router = useRouter();
  const [isApply, setIsApply] = useState(false);
  const toggleApply = () => {
    // 일단은 isApply면 isVote 무조건 flase되도록 해둠.
    toggleVote();
    setIsApply(!isApply);
  };
  const methods = useForm<Form.FormDataDto>({
    defaultValues: {
      title: "",
      allowedAcademicStatus: [],
      allowedGrades: [],
      questions: [
        {
          questionNumber: 1,
          questionType: "OBJECTIVE",
          questionText: "",
          isMultiple: false,
          options: [{ optionNumber: 1, optionText: "" }],
        },
      ],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions" as never,
  });

  const onSubmit = (data) => {
    //TODO 신청서 생성 완료 -> api 연동
    if (selectedStatus.length === 0) {
      setError("allowedAcademicStatus", {
        type: "manual",
        message: "하나 이상의 항목을 선택해야 합니다.",
      });
      return;
    }

    if (selectedGrade.length === 0) {
      setError("allowedGrades", {
        type: "manual",
        message: "하나 이상의 항목을 선택해야 합니다.",
      });
      return;
    }

    console.log(data);
  };

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<(string | number)[]>([]);

  const addSurveyForm = () => {
    const newFormNumber = fields.length + 1;
    append({
      questionNumber: newFormNumber,
      questionType: "OBJECTIVE",
      questionText: "",
      isMultiple: false,
      options: [{ optionNumber: 1, optionText: "" }],
    });
  };

  const handleStatusChange = (status: string) => {
    if (status === "UNDEFINED") {
      if (selectedStatus.includes("UNDEFINED")) {
        setSelectedStatus([]);
        return;
      }
      setSelectedStatus([status]);
      return;
    } else if (selectedStatus.includes("UNDEFINED")) {
      setSelectedStatus([status]);
      return;
    }
    setSelectedStatus((prevStatus) =>
      prevStatus.includes(status)
        ? prevStatus.filter((element) => element !== status)
        : [...prevStatus, status],
    );
  };

  const handleGradeChange = (grade: string | number) => {
    if (grade === "UNDEFINED") {
      if (selectedGrade.includes("UNDEFINED")) {
        setSelectedGrade([]);
        return;
      }
      setSelectedGrade([grade]);
      return;
    } else if (selectedGrade.includes("UNDEFINED")) {
      setSelectedGrade([grade]);
      return;
    }
    setSelectedGrade((prevGrade) =>
      prevGrade.includes(grade)
        ? prevGrade.filter((element) => element !== grade)
        : [...prevGrade, grade],
    );
  };

  useEffect(() => {
    setValue("allowedAcademicStatus", selectedStatus as never);
    if (selectedStatus.length > 0) {
      clearErrors("allowedAcademicStatus");
    }
  }, [selectedStatus]);

  useEffect(() => {
    setValue("allowedGrades", selectedGrade as never);
    if (selectedGrade.length > 0) {
      clearErrors("allowedGrades");
    }
  }, [selectedGrade]);

  const [isViewPointLg, setIsViewPointLg] = useState(false);
  useEffect(() => {
    const checkWidth = () => {
      setIsViewPointLg(window.innerWidth >= 1024 ? true : false);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => {
      window.removeEventListener("resize", checkWidth);
    };
  }, []);

  const statusOptions = [
    { colSize: 1, name: "재학생", value: "ENROLLED" },
    {
      colSize: isViewPointLg ? 2 : 1,
      name: "학생회비 납부자",
      value: "MEMBERSHIP_FEE_PAID",
    },
    { colSize: 1, name: "휴학생", value: "LEAVE_OF_ABSENCE" },
    { colSize: 1, name: "졸업생", value: "GRADUATED" },
    { colSize: isViewPointLg ? 1 : 2, name: "상관없음", value: "UNDEFINED" },
  ];

  const gradeOptions = [
    { colSize: isViewPointLg ? 1 : 2, name: "상관없음", value: "UNDEFINED" },
    { colSize: 1, name: "1-1 수료", value: 1 },
    { colSize: 1, name: "1-2 수료", value: "2" },
    { colSize: 1, name: "2-1 수료", value: "3" },
    { colSize: 1, name: "2-2 수료", value: "4" },
    { colSize: 1, name: "3-1 수료", value: "5" },
    { colSize: 1, name: "3-2 수료", value: "6" },
    { colSize: 1, name: "4-1 수료", value: "7" },
    { colSize: 1, name: "4-2 수료", value: "8" },
    { colSize: 1, name: "5-1 수료", value: "9" },
  ];

  const handlePostSubmit = async () => {
    if (isVote) {
      submitVote();
    } else {
      const postRequest: Post.CreatePostDto = {
        title,
        content,
        boardId,
        isAnonymous,
        isQuestion,
      };
      try {
        const createPostResponse = await createPost(postRequest, selectedFiles);
        console.log("게시물 생성 완료: ", createPostResponse);
        clearPost();
        resetFiles();
        router.back();
      } catch (error) {
        console.error("게시물 생성 에러: ", error);
      }
    }
  };

  return (
    <>
      <div className="bottom-5 top-0 h-full w-full lg:relative lg:bottom-28">
        <div className="w-full flex-col items-center">
          <PreviousButton />
        </div>
        {/* 게시글 공통 부분 - 제목 / 내용 */}
        <div className="flex h-full flex-col p-4 pt-10 lg:p-10">
          {isApply ? (
            <FormProvider {...methods}>
              <div className="h-full w-full">
                <div className="h-16 w-full bg-[#F8F8F8]">
                  <PreviousButton />
                </div>
                <div className="absolute top-16 h-[calc(100%-9rem)] w-full overflow-y-auto">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col items-center gap-8 lg:items-start lg:px-8"
                  >
                    <div className="flex w-56 flex-col items-center border-b border-black">
                      <input
                        type="text"
                        id="title"
                        {...register("title", {
                          required: true,
                        })}
                        placeholder="신청서 제목 텍스트 필드"
                        className="h-10 bg-[#F8F8F8] text-xl placeholder:text-center"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">
                          신청서 제목을 입력해주세요
                        </p>
                      )}
                    </div>
                    <div className="flex h-full w-full flex-col items-center gap-5 lg:items-start">
                      <div className="flex w-3/4 min-w-[260px] items-center justify-around rounded-2xl bg-[#FFF5C5] py-10 lg:min-w-[490px]">
                        <div className="grid grid-cols-2 gap-1 lg:grid-cols-5 lg:gap-2">
                          {statusOptions.map((status, idx) => (
                            <CustomCheckBox
                              colSize={status.colSize as 1 | 2 | 3 | 4 | 5}
                              targetValue={selectedStatus}
                              callback={() => handleStatusChange(status.value)}
                              value={status.value}
                              name={status.name}
                              key={idx}
                            />
                          ))}
                        </div>
                      </div>
                      {errors.allowedAcademicStatus && (
                        <p className="text-red-500">
                          {errors.allowedAcademicStatus.message}
                        </p>
                      )}
                      <hr className="w-3/4 min-w-[260px] border-dashed border-black lg:min-w-[490px]" />
                      <div className="flex w-3/4 min-w-[260px] items-center justify-around rounded-2xl bg-[#FDE4DE] py-10 lg:min-w-[490px]">
                        <div className="grid grid-cols-2 gap-1 lg:grid-cols-5 lg:gap-2">
                          {gradeOptions.map((grade, idx) => (
                            <CustomCheckBox
                              colSize={grade.colSize as 1 | 2 | 3 | 4 | 5}
                              targetValue={selectedGrade}
                              callback={() => handleGradeChange(grade.value)}
                              value={grade.value}
                              name={grade.name}
                              key={idx}
                            />
                          ))}
                        </div>
                      </div>
                      {errors.allowedGrades && (
                        <p className="text-red-500">
                          {errors.allowedGrades.message}
                        </p>
                      )}
                      <hr className="w-3/4 min-w-[260px] border-dashed border-black lg:min-w-[490px]" />
                      <div className="flex w-3/4 min-w-[260px] flex-col bg-white lg:min-w-[500px]"></div>
                    </div>
                    {fields.map((field, idx) => {
                      return (
                        <Question
                          key={field.id}
                          index={idx}
                          removeQuestion={() => remove(idx)}
                        />
                      );
                    })}
                    <button
                      type="button"
                      onClick={addSurveyForm}
                      className="flex h-12 w-3/4 min-w-[260px] items-center justify-center rounded-xl bg-[#D9D9D9] text-[46px] font-bold lg:min-w-[490px]"
                    >
                      +
                    </button>
                  </form>
                </div>
              </div>
            </FormProvider>
          ) : (
            <>
              <PostForm
                title={title}
                content={content}
                isQuestion={isQuestion}
                isAnonymous={isAnonymous}
                isVote={isVote}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onQuestionToggle={toggleQuestion}
                onAnonymousToggle={toggleAnonymous}
              />
              {/* 투표 파트 */}
              {isVote ? (
                <VotingForm
                  voteTitle={voteTitle}
                  options={options}
                  isMultipleChoice={isMultipleChoice}
                  allowAnonymous={allowAnonymous}
                  onVoteTitleChange={setVoteTitle}
                  onAddOption={addVoteOption}
                  onChangeOption={setVoteOption}
                  onRemoveOption={removeVoteOption}
                  onSelectMultiple={toggleMultipleChoice}
                  onAllowAnonymous={toggleAllowAnonymous}
                />
              ) : (
                ""
              )}
              {selectedFiles.length === 0 ? "" : <FilePreview />}
            </>
          )}
        </div>
      </div>
      <CreatePostFooter
        isVote={isVote}
        handleSubmit={isApply ? handleSubmit(onSubmit) : handlePostSubmit}
        handleVoteToggle={toggleVote}
        handleApplyToggle={toggleApply}
      />
    </>
  );
};

export default CreatePostPage;
