"use client";

import {
  ChildCommentCard,
  CommentCard,
  CommentInput,
  PostCard,
} from "@/entities";
import {
  ChildCommentRscService,
  CommentRscService,
  PostRscService,
  PreviousButton,
  useChildCommentStore,
  useCommentStore,
  usePopup,
  usePostDetail,
  usePostStore,
} from "@/shared";

import { useRouter } from "next/navigation";

const PostDetailPage = (props: any) => {
  const postId = props.params.postId;
  const router = useRouter();
  const { isVisible, message, showPopup } = usePopup(2000);
  const {
    isPopupVisible,
    post,
    numLike,
    numFavorite,
    numComment,
    isPostForm,
    formId,
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
    togglePostPopup,
  } = usePostStore();
  const {
    comments,
    incrementCommentLike,
    decrementCommentLike,
    clearAllOverlays,
    addChildComment,
    setComments,
    deleteComment,
    toggleCommentPopup,
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
      showPopup("이미 좋아요를 누른 게시글입니다.");
    }
  };

  const handleDeletePost = async () => {
    try {
      const deletePostResponse = await PostRscService().deletePost(postId);
      router.back();
      console.log("게시물 삭제 완료: ", deletePostResponse);
    } catch (error) {
      console.error("게시글 삭제 처리 에러: ", error);
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
      showPopup("이미 좋아요를 누른 댓글입니다.");
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
      showPopup("이미 좋아요를 누른 댓글입니다.");
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
      showPopup("이미 즐겨찾기를 누른 게시글입니다.");
    }
  };

  const handleAddComment = async (
    newComentContent: string,
    isAnonymous: boolean,
  ) => {
    if (!createCommentInfo.isChildComment) {
      const createComment: Comment.CreateCommentDto = {
        content: newComentContent,
        postId: postId,
        isAnonymous: isAnonymous,
      };
      try {
        const createCommentResponse =
          await CommentRscService().createComment(createComment);
        console.log("게시물 댓글 완료: ", createCommentResponse);
        addComment(createCommentResponse);
        setComments(createCommentResponse.id, false, true, false, [], 0);
        incrementComment();
      } catch (error) {
        console.error("게시물 댓글 처리 에러: ", error);
        decrementComment();
      }
    } else {
      const createChildComment: ChildComment.CreateChildCommentDto = {
        content: newComentContent,
        isAnonymous: isAnonymous,
        parentCommentId: createCommentInfo.commentId!,
      };
      try {
        const createChildCommentResponse =
          await ChildCommentRscService().createChildComment(createChildComment);
        console.log("대댓글 완료: ", createChildCommentResponse);
        addChildComment(
          createCommentInfo.commentId!,
          createChildCommentResponse,
        );
        setChildCommentLikes(createChildCommentResponse.id, 0);
        incrementComment();
      } catch (error) {
        console.error("게시물 대댓글 처리 에러: ", error);
        decrementComment();
      }
    }
  };

  const togglePostPopupMenu = () => {
    console.log(post?.isOwner);
    if (post?.isOwner) {
      togglePostPopup();
      console.log(isPopupVisible);
    }
  };

  const toggleCommentPopupMenu = (commentId: string) => {
    console.log(comments[commentId].isOwner);
    console.log("comment popuyp");
    console.log(comments[commentId].isCommentPopupVisible);
    if (comments[commentId].isOwner) {
      toggleCommentPopup(commentId);
      console.log(comments[commentId].isCommentPopupVisible);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const deleteCommentResponse =
        await CommentRscService().deleteCommentById(commentId);
      deleteComment(commentId);
      toggleCommentPopup(commentId);
      console.log("게시물 삭제 완료: ", deleteCommentResponse);
    } catch (error) {
      console.error("게시글 삭제 처리 에러: ", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bottom-5 top-0 h-full w-full bg-boardPageBackground scrollbar-hide lg:relative">
      {isVisible && (
        <div
          className={`duration-2000 fixed left-1/2 top-20 -translate-x-1/2 transform rounded-lg bg-red-600 p-4 text-white shadow-lg transition-opacity ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 9999 }}
        >
          {message}
        </div>
      )}
      <div className="h-16 w-full bg-[#F8F8F8]">
        <PreviousButton />
      </div>
      <div className="flex h-[calc(100%-9rem)] w-full flex-col space-y-3 overflow-y-auto p-3">
        <div className="sm:pl-3">
          <PostCard
            postData={post}
            numComment={numComment}
            numFavorite={numFavorite}
            numLike={numLike}
            isPostForm={isPostForm}
            formId={formId}
            handlePostFavorite={handlePostFavorite}
            handlePostLike={handlePostLike}
            handleCommentBtn={changeToPostComment}
            hasVote={true}
            options={["1등", "2등", "3등"]}
            handlePostDelete={handleDeletePost}
            toggleMenu={togglePostPopupMenu}
            isPopupVisible={isPopupVisible}
          />
          <div className="pl-4 sm:pt-3">
            {commentList.map((comment) => {
              const commentData = comments[comment.id] || {
                numLike: 0,
                isOwner: false,
                isDeleted: false,
                overlayActive: false,
                childCommentList: [],
              };
              return (
                <div key={comment.id}>
                  <CommentCard
                    comment={comment}
                    numLike={commentData.numLike}
                    overlayActive={commentData.overlayActive}
                    isDeleted={commentData.isDeleted}
                    handleCommentToggle={() =>
                      toggleCommentPopupMenu(comment.id)
                    }
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
