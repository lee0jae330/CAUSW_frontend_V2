"use client"

import { useUserStore } from "@/shared";
import Image from "next/image";

// 여기도 좋아요 싫어요 디자인 문의하기
interface CommentCardProps {
  writerName: string;
  writerAdmissionYear: number;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isAnonymous: boolean;
  numLike: number;
}

// max-w-md mx-auto space-x-4
export const CommentCard = ({ writerName, writerAdmissionYear, writerProfileImage, content, createdAt, updatedAt, isDeleted, isAnonymous, numLike }: CommentCardProps) => {
  writerProfileImage = useUserStore((state) => state.profileImage);
  return (
    <div className="relative flex flex-col border-black border-comment-bw rounded-comment-br p-1 pb-2 bg-white mb-4 max-w-sm">
      <button className="absolute top-3 right-3 flex items-center justify-center w-10 h-10">
        <Image
          src="/images/post/comment-menu.svg"
          alt="Comment Menu"
          width={4}
          height={4}
        ></Image>
      </button>

      <div className="flex flex-row items-center px-2 mb-1">
        <div
          className="m-2 w-10 h-10 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${writerProfileImage})` }}
        />
        <div className="font-bold text-[16px]">{isAnonymous ? "익명" : writerName}</div>
      </div>

      <div className="text-gray-700 mb-1 px-10 text-[14px]">{content}</div>

      <button className="flex flex-row justify-start items-center space-x-2 px-10 text-post-like text-[12px]">
        <Image
          src="/images/post/like.svg"
          alt="Like Icon"
          width={16}
          height={16}
        ></Image>
        <span>{numLike}</span>
      </button>

      <div className="absolute flex flex-row items-center justify-between space-x-3 px-2 py-1 bottom-2 right-10  bg-comment-btn rounded-comment-br">
        <button>
          <Image
            src="/images/post/comment-like.svg"
            alt="Like Icon"
            width={16}
            height={16}
            className="items-center"
          ></Image>
        </button>
        <Image
          src="/images/post/comment-divide.svg"
          alt="Like Icon"
          width={3}
          height={10}
          className="items-center"
        ></Image>
        <button>
          <Image
            src="/images/post/comment-comment.svg"
            alt="Like Icon"
            width={16}
            height={16}
            className="items-center"
          ></Image>
        </button>
      </div>
    </div>
  );
};
