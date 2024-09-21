"use client";
import {
  PostCard,
  CommentCard,
  ChildCommentCard,
  CommentInput,
} from "@/entities";
import {
  PreviousButton,
  PostRscService,
  CommentRscService,
  ChildCommentRscService,
  usePostDetail,
  usePostStore,
  useCommentStore,
  useChildCommentStore,
  useUserStore,
} from "@/shared";

const PostDetailPage = (props: any) => {
  const postId = props.params.postId;

  const { name, admissionYear, profileImage } = useUserStore();
  const {
    post,
    numLike,
    numFavorite,
    numComment,
    commentList,
    createCommentInfo,
    incrementComment,
    decrementComment,
    addComment,
    setPostComment,
    incrementLike,
    decrementLike,
    incrementFavorite,
    decrementFavorite,
  } = usePostStore();
  const {
    comments,
    incrementCommentLike,
    decrementCommentLike,
    clearAllOverlays,
    addChildComment,
    setComments,
  } = useCommentStore();
  const {
    childComments,
    setChildCommentLikes,
    incrementChildCommentLike,
    decrementChildCommentLike,
  } = useChildCommentStore();

  usePostDetail(postId);

  const changeToPostComment = () => {
    setPostComment();
    clearAllOverlays();
  };

  const handlePostLike = async () => {
    try {
      incrementLike();
      const createPostResponse = await PostRscService().postLikeForPost(postId);
      console.log("게시물 좋아요 완료: ", createPostResponse);
    } catch (error) {
      console.error("좋아요 처리 에러: ", error);
      decrementLike();
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      incrementCommentLike(commentId);
      const PostCommentLikeResponse =
        await CommentRscService().postLikeForComment(commentId);
      console.log("댓글 좋앙 완료:", PostCommentLikeResponse);
    } catch (error) {
      console.error("댓글 좋아요 처리 에러: ", error);
      decrementCommentLike(commentId);
    }
  };

  const handleChildCommentLike = async (childCommentId: string) => {
    try {
      incrementChildCommentLike(childCommentId);
      const PostChildCommentLikeResponse =
        await ChildCommentRscService().postLikeForChildComment(childCommentId);
      console.log("대댓글 좋앙 완료:", PostChildCommentLikeResponse);
    } catch (error) {
      console.error("대댓글 좋아요 처리 에러: ", error);
      decrementChildCommentLike(childCommentId);
    }
  };

  const handlePostFavorite = async () => {
    try {
      incrementFavorite();
      const createPostResponse = await PostRscService().postFavorite(postId);
      console.log("게시물 즐겨찾기 완료: ", createPostResponse);
    } catch (error) {
      console.error("즐겨찾기 처리 에러: ", error);
      decrementFavorite();
    }
  };

  const handleAddComment = async (
    newComentContent: string,
    isAnonymous: boolean,
  ) => {
    if (!createCommentInfo.isChildComment) {
      const tempCommentId = `new_${Date.now()}`;
      const newComment: Comment.CommentDto = {
        id: tempCommentId,
        content: newComentContent,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        isDeleted: false,
        postId: postId,
        writerName: name,
        writerAdmissionYear: admissionYear,
        writerProfileImage: profileImage,
        updatable: false,
        deletable: false,
        isAnonymous: isAnonymous,
        numLike: 0,
        numChildComment: 0,
        childCommentList: [],
        isCommentLike: false
      };
      const createComment: Comment.CreateCommentDto = {
        content: newComentContent,
        postId: postId,
        isAnonymous: isAnonymous,
      };
      try {
        addComment(newComment);
        setComments(tempCommentId, [], 0);
        incrementComment();
        console.log(commentList);
        const createCommentResponse =
          await CommentRscService().createComment(createComment);
        console.log("게시물 댓글 완료: ", createCommentResponse);
      } catch (error) {
        console.error("게시물 댓글 처리 에러: ", error);
        decrementComment();
      }
    } else {
      const tempChildCommentId = `new_${Date.now()}`;
      const newChildComment: ChildComment.ChildCommentDto = {
        id: tempChildCommentId,
        content: newComentContent,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        isDeleted: false,
        writerName: name,
        writerAdmissionYear: admissionYear,
        writerProfileImage: profileImage,
        updatable: false,
        deletable: false,
        isAnonymous: isAnonymous,
        numLike: 0,
        isChildCommentLike: false,
      };
      const createChildComment: ChildComment.CreateChildCommentDto = {
        content: newComentContent,
        isAnonymous: isAnonymous,
        parentCommentId: createCommentInfo.commentId!,
      };
      try {
        addChildComment(createCommentInfo.commentId!, newChildComment);
        setChildCommentLikes(tempChildCommentId, 0);
        incrementComment();
        console.log(childComments);
        const createChildCommentResponse =
          await ChildCommentRscService().createChildComment(createChildComment);
        console.log("대댓글 완료: ", createChildCommentResponse);
      } catch (error) {
        console.error("게시물 대댓글 처리 에러: ", error);
        decrementComment();
      }
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bottom-6 h-full w-full overflow-y-auto bg-boardPageBackground scrollbar-hide">
      <div className="w-full flex-col items-center">
        <PreviousButton />
      </div>
      <div className="flex w-full flex-col space-y-3 p-3 pt-14">
        <div className="sm:pl-3">
          <PostCard
            postData={post}
            numComment={numComment}
            numFavorite={numFavorite}
            numLike={numLike}
            handlePostFavorite={handlePostFavorite}
            handlePostLike={handlePostLike}
            handleCommentBtn={changeToPostComment}
          />
          <div className="pl-4 sm:pt-3">
            {commentList.map((comment) => {
              const commentData = comments[comment.id] || {
                numLike: 0,
                overlayActive: false,
              };
              return (
                <div key={comment.id}>
                  <CommentCard
                    comment={comment}
                    numLike={commentData.numLike}
                    overlayActive={commentData.overlayActive}
                    handleCommentLike={() => handleCommentLike(comment.id)}
                  />
                  {commentData.childCommentList.map((childComment, idx) => (
                    <ChildCommentCard
                      key={childComment.id}
                      childComment={childComment}
                      numLike={childComments[childComment.id].numLike}
                      handleChildCommentLike={() =>
                        handleChildCommentLike(childComment.id)
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center py-2">
          <CommentInput handleAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
};
export default PostDetailPage;
