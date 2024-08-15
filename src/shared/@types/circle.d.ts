declare namespace Circle {
  export type Status = "AWAIT" | "DROP" | "LEAVE" | "MEMBER" | "REJECT";

  export interface CircleUser {
    id: string;
    status: Status;
    user: User.User;
    circle: FindByIdDto;
  }
  export type GetUserListResponseDto = CircleUser[];
  export type GetUserListResponse = Model.CircleUser[];

  export interface FindByIdDto {
    id: string;
    name: string;
    description: string;
    mainImage: string | null;
    leaderId: string;
    leaderName: string;
    numMember: number;
    createdAt: Date;
    isJoined: boolean;
    joinedAt: Date | null;
    isDeleted: boolean;
  }

  export interface Board {
    id: string;
    name: string;
    postId: string | null;
    postTitle: string | null;
    postCreatedAt: Date | null;
    postNumComment: number | null;
    postWriterName: string | null;
    postWriterStudentId: string | null;
  }

  export interface FindBoardsDto {
    circle: FindByIdDto;
    boardList: Board[];
  }

  export interface FindBoards {
    circle: Model.Circle;
    boards: Model.CircleBoard[];
  }

  // Client
  // 기본, 신청완료, 대기중, 가입됨, 제한
  export type JoinStatus = "NONE" | "DONE" | "AWAIT" | "MEMBER" | "BLOCK";

  //DTO
  export interface CreateRequestDto {
    mainImage: string;
    name: string;
    description: string;
    leaderId: string;
  }

  export type UpdateRequestDto = Omit<CreateRequestDto, "leaderId">;

  export type CirclesRequestDto = FindByIdDto[] & Error.ApiErrorResponse;
  export type CircleRequestDto = FindByIdDto & Error.ApiErrorResponse;
}
