"use client";

import Image from "next/image";
import { PopupMenu } from "./PopupMenu";
import VotingSection from "./VotingSection";
import { usePostStore } from "@/shared";

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
  hasVote,
  options,
  toggleMenu,
  isPopupVisible,
}: PostCardProps) => {
  const userImage =
    postData.writerProfileImage ?? "/images/default_profile.png";
  //const {isPopupVisible} = usePostStore();
  console.log("postData", postData);
  console.log("formId: ", formId);
  return (
    <div className="relative mb-4 mt-4 flex max-w-xl flex-col rounded-post-br border bg-post p-2 shadow-post-sh">
      {isPopupVisible ? (
        <PopupMenu message="게시글 삭제" handleBtn={handlePostDelete} />
      ) : (
        ""
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

      <div className="flex flex-col items-start px-3">
        <div>
          <div className="mb-2 px-1 text-[24px] font-medium">
            {postData.title}
          </div>
          <div className="mb-2 px-1 pb-2 text-[16px]">{postData.content}</div>

          {/* 나중에 투표 api 생기면 연결 */}
          {postData.isPostVote ? (
            // TODO css 물어봐야됨
            <div className="w-32 w-full lg:pr-12">
              <VotingSection
                isResult={true}
                //isMultiple={false}
                //isAnonymous={false}
                onVote={function (selectedOptions: string[]): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="grid w-full auto-cols-max grid-flow-col gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {postData.fileUrlList.map((attachment, index) =>
            isImageFile(attachment) ? (
              <div
                key={index}
                className="w-min-20 h-min-20 h-20 w-20 border border-black bg-cover bg-center"
                style={{ backgroundImage: `url(${attachment})` }}
              />
            ) : (
              <div
                key={index}
                className="w-min-20 h-min-20 flex h-20 w-20 flex-col items-center justify-center space-y-2 border border-black p-2"
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
          <button className="flex items-center space-x-2 rounded-post-br bg-post-form p-1 px-3 text-[12px] text-black">
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
