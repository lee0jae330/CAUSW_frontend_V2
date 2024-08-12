/**
 * @description 나중에 게시물 + 사용자 정보로 바뀔 예정
 * @description 중복되는 코드 개선 필요
 */

interface BoardInfoType {
  emoji: string | null;
  title: string;
  contents: Array<{ title: string }>;
}

const defaultBoardInfos: Array<BoardInfoType> = [
  {
    emoji: "❗",
    title: "서비스 공지",
    contents: [
      {
        title: `서버 점검 18:00 ~ 21:00`,
      },
      {
        title: `서버 점검 18:00 ~ 21:00`,
      },
      {
        title: `서버 점검 18:00 ~ 21:00`,
      },
    ],
  },
  {
    emoji: "🏆",
    title: "학생회 공지 게시판",
    contents: [
      {
        title: `기말고사 간식 행사 안내`,
      },
      {
        title: `신복편전 안내`,
      },
      {
        title: `체육 대회 안내`,
      },
    ],
  },
  {
    emoji: "📖",
    title: "소프트웨어학부 공지",
    contents: [
      {
        title: `탑싯 서류 제출 안내`,
      },
      {
        title: `기말고사 시험표`,
      },
      {
        title: `성적 조회 안내`,
      },
    ],
  },
  {
    emoji: "🌏",
    title: "동문회 공지 게시판",
    contents: [
      {
        title: `???????????????????`,
      },
      {
        title: `ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㄹㄹㄹㄹㄹㄹㄹㅇㅇㅇㅇㅇㅇㅇㅇㅇasdasd`,
      },
      {
        title: `ㅁㄴㅇㄴㅁㅇㅁㅇㅁㅈㅇㅁㅇㅁㄴㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴ`,
      },
    ],
  },
];

const customBoardInfos: Array<BoardInfoType> = [
  {
    emoji: null,
    title: "스포츠 게시판",
    contents: [
      {
        title: `3대 500 달성법`,
      },
      {
        title: `벤치프레스 그립의 종류`,
      },
      {
        title: `메시 vs 호날두`,
      },
    ],
  },
  {
    emoji: null,
    title: "과제 게시판",
    contents: [
      {
        title: `프로그래밍 과제 너무 어려워요 ㅠㅠ`,
      },
      {
        title: `수치해석 퀴즈 뭐지...`,
      },
      {
        title: `운영체제 데드락 과제 ㅁㄴㅇㅁㅇㅇㅁㅇㅇㄴㅇㅁ`,
      },
    ],
  },
  {
    emoji: null,
    title: "스포츠 게시판",
    contents: [
      {
        title: `3대 500 달성법`,
      },
      {
        title: `벤치프레스 그립의 종류`,
      },
      {
        title: `메시 vs 호날두`,
      },
    ],
  },
  {
    emoji: null,
    title: "과제 게시판",
    contents: [
      {
        title: `프로그래밍 과제 너무 어려워요 ㅠㅠ`,
      },
      {
        title: `수치해석 퀴즈 뭐지...`,
      },
      {
        title: `운영체제 데드락 과제 ㅁㄴㅇㅁㅇㅇㅁㅇㅇㄴㅇㅁ`,
      },
    ],
  },
  {
    emoji: null,
    title: "스포츠 게시판",
    contents: [
      {
        title: `3대 500 달성법`,
      },
      {
        title: `벤치프레스 그립의 종류`,
      },
      {
        title: `메시 vs 호날두`,
      },
    ],
  },
  {
    emoji: null,
    title: "과제 게시판",
    contents: [
      {
        title: `프로그래밍 과제 너무 어려워요 ㅠㅠ`,
      },
      {
        title: `수치해석 퀴즈 뭐지...`,
      },
      {
        title: `운영체제 데드락 과제 ㅁㄴㅇㅁㅇㅇㅁㅇㅇㄴㅇㅁ`,
      },
    ],
  },
];

const Board = ({ emoji, title, contents }: BoardInfoType) => (
  <div>
    <h1 className="truncate text-xl font-semibold">
      {emoji}
      <span className="underline">{title}</span>
    </h1>
    <div className="mt-4 rounded-2xl border border-black bg-white px-4 text-center shadow-lg">
      <ul className="divide-y-2">
        {contents.map((content) => (
          <li className="truncate py-2">{content.title}</li>
        ))}
      </ul>
    </div>
  </div>
);

const DefaultBoard = ({ boardInfos }: { boardInfos: Array<BoardInfoType> }) => (
  <div className="grid grid-cols-1 gap-x-5 gap-y-5 rounded-2xl border border-red-500 bg-boardBackground p-10 lg:grid-cols-2 lg:gap-y-10">
    {boardInfos.map((boardInfo) => (
      <Board
        emoji={boardInfo.emoji}
        title={boardInfo.title}
        contents={boardInfo.contents}
      />
    ))}
  </div>
);

const CustomBoard = ({ boardInfos }: { boardInfos: Array<BoardInfoType> }) => (
  <div className="grid grid-cols-1 gap-x-5 gap-y-5 bg-white p-10 lg:grid-cols-2 lg:gap-y-10">
    {boardInfos.map((boardInfos) => (
      <Board
        emoji={boardInfos.emoji}
        title={boardInfos.title}
        contents={boardInfos.contents}
      />
    ))}
  </div>
);

const BoardPage = () => {
  return (
    <div className="absolute bottom-24 top-28 w-full overflow-y-auto p-6 md:bottom-0 md:left-40 md:right-72 md:top-0 md:w-auto">
      <div className="h-full lg:h-auto">
        <DefaultBoard boardInfos={defaultBoardInfos} />
        <CustomBoard boardInfos={customBoardInfos} />
      </div>
    </div>
  );
};

export default BoardPage;
