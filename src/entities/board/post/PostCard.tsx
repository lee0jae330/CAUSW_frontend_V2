"use client";

import { usePostStore, useVoteStore, VoteRscService } from "@/shared";
import Image from "next/image";
import { PopupMenu } from "./PopupMenu";
import VotingSection from "./VotingSection";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
// 투표 / 사진 / 신청서??? 화면 이해가 진행되어야 할듯
// ++ 이거 버튼 조금 요청해야할듯 2개 잇는 거 이해 안됨
interface PostCardProps {
  postData: Post.PostDto;
  numLike: number;
  numFavorite: number;
  numComment: number;
  isPostForm: boolean;
  formId: string;
  handlePostLike: () => void;
  handlePostFavorite: () => void;
  handleCommentBtn: () => void;
  handlePostDelete: () => void;
  hasVote: boolean;
  options: string[];
  toggleMenu: () => void;
  isPopupVisible: boolean;
}

const isImageFile = (fileName: string) => {
  return /\.(jpg|jpeg|png|gif|bmp)$/.test(fileName);
};

const extractFileName = (url: string) => {
  return url.substring(url.lastIndexOf("/") + 1);
};

export const PostCard = ({
  postData,
  numLike,
  numComment,
  numFavorite,
  isPostForm,
  formId,
  handlePostLike,
  handlePostFavorite,
  handleCommentBtn,
  handlePostDelete,
  toggleMenu,
  isPopupVisible,
}: PostCardProps) => {
  const userImage =
    postData.writerProfileImage ?? "/images/default_profile.png";
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const {
    vote,
    totalVote,
    voteOptions,
    votedMostOptions,
    castVote,
    cancelVote,
    endVote,
  } = useVoteStore();

  const handleCastVote = async (selectedOptions: string[]) => {
    try {
      const options: Post.CastVoteDto = {
        voteOptionIdList: selectedOptions,
      };
      const castVoteResponse = await VoteRscService().castVote(options);
      castVote(selectedOptions);
      console.log("투표완료: ", castVoteResponse);
    } catch (error) {
      cancelVote(selectedOptions);
      console.error("투표 처리 에러: ", error);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setPopupImage(imageUrl);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupImage(null);
  };
/* 
  const handleDownload = (fileUrl: string) => {
    console.log(fileUrl);
    const decodedUrl = decodeURIComponent(fileUrl) ;
    const fileNameWithUuid = decodedUrl. substring(decodedUrl.lastIndexOf('/') + 1);
    const filename= fileNameWithUuid.split('_')[0];
    
    const encodedFileName = encodeURIComponent(filename);
    console.log(encodedFileName);
    //const link = document.createElement("a");
    //link.href = fileUrl;
    //link.download = extractFileName(fileUrl); // 파일명 설정
    //link.click();
  }; */

  const openFileLink = (url) => {
    const fileName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1)); // 파일명 추출 후 디코딩
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); // 확장자 추출

    if (fileExtension === "pdf" || fileExtension === "jpg" || fileExtension === "png") {
      // PDF나 이미지 파일은 새 탭에서 열기
      window.open(url, '_blank');
    } else {
      // 그 외 파일은 다운로드
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const extractFileName = (url) => {
    const decodeFile = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1));
    const filename= decodeFile.split('_')[0];
    const fileExtension = decodeFile.substring(decodeFile.lastIndexOf('.') + 1);
    return (filename+"."+fileExtension);
  };
  //const {isPopupVisible} = usePostStore();
  const router = useRouter();
  const params = useParams();

  const { boardId, postId } = params;

  const popMenuList = [
    { message: "게시물 삭제", handleBtn: handlePostDelete },
    ...(postData.isOwner && postData.isPostForm
      ? [
          {
            message: "신청 현황 보기",
            handleBtn: () =>
              router.push(`/board/${boardId}/${postId}/formInfo/${formId}`),
          },
        ]
      : []),
  ];

  return (
    <div className="relative mb-4 mt-4 flex max-w-xl flex-col rounded-post-br border bg-post p-2 shadow-post-sh">
      {isPopupVisible && (
        <div>
          <PopupMenu PopupMenuChildren={popMenuList} />
        </div>
      )}
      <button
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center"
        onClick={toggleMenu}
      >
        <Image
          src="/images/post/comment-menu.svg"
          alt="Comment Menu"
          width={4}
          height={4}
        ></Image>
      </button>
      <div className="flex flex-row items-center p-2">
        <Image
          src={userImage}
          alt="Comment Profil"
          width={80}
          height={80}
          className="m-2 bg-contain bg-center bg-no-repeat"
        />
        <div className="flex flex-col items-start">
          <div className="flex items-center text-[16px] font-bold">
            {" "}
            {postData.isAnonymous ? "익명" : postData.writerName}
          </div>
          <div className="text-[14px] text-gray-500">{postData.updatedAt}</div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start px-3">
        <div className="w-full">
          <div className="mb-2 px-1 text-[24px] font-medium">
            {postData.title}
          </div>
          <div className="mb-2 px-1 pb-2 text-[16px]">{postData.content}</div>

          {/* 나중에 투표 api 생기면 연결 */}
          {postData.isPostVote ? (
            <div className="flex w-full lg:pr-12">
              <VotingSection onVote={handleCastVote} />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="relative">
          <div className="grid w-full auto-cols-max grid-flow-col gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {postData.fileUrlList.map((attachment, index) =>
              isImageFile(attachment) ? (
                <div
                  key={index}
                  className="w-min-20 h-min-20 h-20 w-20 border border-black bg-cover bg-center"
                  style={{ backgroundImage: `url(${attachment})` }}
                  onClick={() => handleImageClick(attachment)}
                />
              ) : (
                <div
                  key={index}
                  className="w-min-20 h-min-20 flex h-20 w-20 flex-col items-center justify-center space-y-2 border border-black p-2"
                  onClick={() => openFileLink(attachment)}
                >
                  <Image
                    src="/images/post/file-icon.svg"
                    alt={extractFileName(attachment)}
                    width={30}
                    height={30}
                  />
                  <span className="text-[10px]">
                    {extractFileName(attachment)}
                  </span>
                </div>
              ),
            )}
          </div>
          {isPopupOpen && popupImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center">
                <div className="relative h-auto w-auto bg-black">
                  <Image
                    src={popupImage}
                    alt="Preview Image"
                    width={300} // 기본 너비를 지정합니다. 필요시 조정
                    height={300} // 기본 높이를 지정합니다. 필요시 조정
                    objectFit="contain" // 원본 비율 유지
                    unoptimized
                  />
                </div>
                <button
                  onClick={handleClosePopup}
                  className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center text-white hover:bg-gray-700"
                >
                  x
                </button>
                <button
                  onClick={()=>openFileLink(popupImage)}
                  className="absolute right-[40px] top-1 z-50 flex h-10 w-10 items-center justify-center text-white"
                >
                  ↓
                </button>
              </div>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={handleClosePopup}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* 디자인 따라 위치 조정해야함 */}
      <div className="flex flex-row space-x-3 p-2">
        <button
          className="flex items-center space-x-2 rounded-post-br bg-post-like p-1 px-3 text-[13px] text-post-like"
          onClick={handlePostLike}
        >
          <Image
            src="/images/post/like.svg"
            alt="Like Icon"
            width={20}
            height={20}
          ></Image>
          <span>{numLike > 999 ? "999+" : numLike}</span>
        </button>
        <button
          className="flex items-center space-x-2 rounded-post-br bg-post-star p-1 px-3 text-[13px] text-post-star"
          onClick={handlePostFavorite}
        >
          <Image
            src="/images/post/star.svg"
            alt="Favorite Icon"
            width={20}
            height={20}
          ></Image>
          <span>{numFavorite > 999 ? "999+" : numFavorite}</span>
        </button>
        <button
          className="flex items-center space-x-2 rounded-post-br bg-post-comment p-1 px-3 text-[13px] text-post-comment"
          onClick={handleCommentBtn}
        >
          <Image
            src="/images/post/comment.svg"
            alt="Comment Icon"
            width={20}
            height={20}
          ></Image>
          <span>{numComment > 999 ? "999+" : numComment}</span>
        </button>
        {isPostForm && (
          <button
            className="flex items-center space-x-2 rounded-post-br bg-post-form p-1 px-3 text-[12px] text-black"
            onClick={() => {
              router.push(`/board/${boardId}/${postId}/${formId}`);
            }}
          >
            <Image
              src="/images/post/form.svg"
              alt="Form Icon"
              width={20}
              height={20}
            ></Image>
            <span>form 작성</span>
          </button>
        )}
      </div>
    </div>
  );
};
