import { createContext, useReducer, useState, useEffect } from "react";

export const PostList = createContext({
    postList : [],
    fetching : true,
    addPost : () => {},
    deletePost : () => {},
});

const postListReducer = (currentPostList, action) => {
    let newPostList = currentPostList;
    if (action.type === 'DELETE_POST'){
        newPostList = currentPostList.filter(post => post.id !== action.payload.postId);
    } else if (action.type === 'ADD_INITIAL_POSTS'){
        newPostList = action.payload.posts;
    } else if (action.type === 'ADD_POST'){
        newPostList = [action.payload, ...currentPostList]
    }
    return newPostList;

}

const PostListProvider = ({children}) => {

    const [postList, dispatchPostList] = useReducer(postListReducer, [])
    const [ fetching, setFetching ] = useState(false);


    const addInitialPosts = (posts)=>{
        dispatchPostList({
            type:'ADD_INITIAL_POSTS',
            payload: {
                posts
            }
        })
    }


    const addPost = (userId, postTitle, postBody, reactions, tags) => {
        dispatchPostList({
          type: "ADD_POST",
          payload: {
            id: Date.now(),
            title: postTitle,
            body: postBody,
            reactions: reactions,
            userId: userId,
            tags: tags,
          },
        });
      };

    const deletePost = (postId)=>{
        dispatchPostList({
            type: 'DELETE_POST',
            payload: {
                postId
            }
        })
    }

    useEffect(()=>{
        setFetching(true);
        const controller = new AbortController();
        const signal = controller.signal;
    
    
        fetch('https://dummyjson.com/posts', { signal })
        .then(res => res.json())
        .then(data => {
          addInitialPosts(data.posts);
        setFetching(false);
      });
    
      return () => {
        controller.abort();  
      }
      }, []);

 return <PostList.Provider value={
    {postList, fetching, addPost, deletePost}
 }>
    {children}
 </PostList.Provider>
}


export default PostListProvider;