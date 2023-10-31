import "./Post.css";

export default function Post({ post }) {
    return (
        <div id="post">
            Author: <h3>{post.postData.author}</h3>
            <audio src={post.audioURL} controls></audio>
            <p>
                Title: {post.postData.title}
                Views: {post.postData.views}
                Likes: {post.postData.likes}
                {post.postData.dateCreated}
            </p>
        </div>
    );
}
