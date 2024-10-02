import { MainBoardRscService, CircleRscService } from "@/shared";
import { CustomBoard, DefaultBoard, IBoardInfo } from "@/entities";

import Link from "next/link";

const CircleBoards = async ({ params: { id } }: { params: { id: string } }) => {
  const { getMainBoard } = MainBoardRscService();
  const { getCircleBoards } = CircleRscService();
  const mainBoards = (await getMainBoard()) as Array<IBoardInfo>;
  const circleBoardIds = await getCircleBoards(id).then((circleBoards) =>
    circleBoards.boardList.map((circleBoard) => circleBoard.id),
  );

  const defaultBoards: Array<IBoardInfo> = [];
  const commonBoards: Array<IBoardInfo> = [];

  mainBoards.forEach((element) => {
    if (circleBoardIds.includes(element.boardId)) {
      if (element.boardName.includes("공지")) defaultBoards.push(element);
      else commonBoards.push(element);
    }
  });

  return (
    <>
      <div className="absolute h-full w-full py-3">
        <div className="flex flex-col items-center">
          <DefaultBoard boardInfos={defaultBoards} />
          <CustomBoard boardInfos={commonBoards} />
        </div>
      </div>
      <Link href={`/board/create`}>
        <button className="fixed bottom-28 left-1/2 -translate-x-1/2 transform rounded-3xl bg-red-500 px-6 py-3 font-bold text-white lg:bottom-10">
          게시판 생성
        </button>
      </Link>
    </>
  );
};

export default CircleBoards;
