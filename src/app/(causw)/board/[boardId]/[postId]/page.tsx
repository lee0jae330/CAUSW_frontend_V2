"use client"
import {
  PostCard,
  CommentCard,
  ChildCommentCard,
  CommentInput,
} from "@/entities";
import { PreviousButton, PostRscService, CommentRscService, usePostDetail, usePostStore } from "@/shared";

const PostDetailPage = (props: any) => {
  const postId = props.params.postId;

  const { post, numLike, numFavorite, numComment, commentList, decrementComment, addComment, incrementLike, decrementLike, incrementFavorite, decrementFavorite } = usePostStore();
  
  usePostDetail(postId);

  const handlePostLike = async () => {
    try {
      incrementLike();
      const createPostResponse = await PostRscService().postLikeForPost(postId);
      console.log('게시물 좋아요 완료: ', createPostResponse);
    } catch (error) {
      console.error('좋아요 처리 에러: ', error);
      decrementLike();
    }  
  };
  
  const handlePostFavorite = async () => {
    try {
      incrementFavorite();
      const createPostResponse = await PostRscService().postFavorite(postId);
      console.log('게시물 즐겨찾기 완료: ', createPostResponse);
    } catch (error) {
      console.error('즐겨찾기 처리 에러: ', error);
      decrementFavorite();
    }  
  };

  const handleAddComment = async (newComentContent: string, isAnonymous: boolean) => {
    const newComment: Comment.CommentDto = {
      id: `new_${Date.now()}`,
      content: newComentContent,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      isDeleted: false,
      postId: postId,
      writerName: '일단 임시로 사용자',
      writerAdmissionYear: 0,
      writerProfileImage: "",
      updatable: false,
      deletable: false,
      isAnonymous: isAnonymous,
      numLike: 0,
      numChildComment: 0,
      childCommentList: [],
    };
    const createComment: Comment.CreateCommentDto = {
      content: newComentContent,
      postId: postId,
      isAnonymous: isAnonymous
    }
    try {
      addComment(newComment);
      const createCommentResponse = await CommentRscService().createComment(createComment);
      console.log('게시물 댓글 완료: ', createCommentResponse);
    }catch(error) {
      console.error('즐겨찾기 처리 에러: ', error);
      decrementComment();
    }  
    
  }
  
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full h-full bottom-6 overflow-y-auto bg-boardPageBackground scrollbar-hide">
      <div className="w-full flex-col items-center">
        <PreviousButton />
      </div>
      <div className="w-full flex flex-col space-y-3 p-3 pt-14">
        <div className="sm:pl-3">
          <PostCard 
            postData={post}
            numComment={numComment}
            numFavorite={numFavorite}
            numLike={numLike}
            handlePostComment={()=>{}}
            handlePostFavorite={handlePostFavorite}
            handlePostLike={handlePostLike}
          />
          <div className="pl-4 sm:pt-3">
            {commentList.map((comment, index) => (
              <div key={index}>
                <CommentCard 
                  comment={comment}
                  numLike={comment.numLike}                      
                />
                {comment.childCommentList.map((childComment, idx) => (
                  <ChildCommentCard key={idx} 
                  childComment={childComment}
                  numLike={childComment.numLike}                        
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center py-2">
          <CommentInput handleAddComment={handleAddComment}/>
        </div>
      </div>
    </div>
  );
};
export default PostDetailPage;