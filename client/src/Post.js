import "./Post.css";
import like from "./like.svg";
import listens from "./listens.svg";
import user from "./assets/default_user.svg";

export default function Post({ post }) {
    function toggleLike(event) {
        event.target.classList.toggle("liked");
    }

    let date = new Date(post.postData.dateCreated);
    return (
        <div id="post">
            <h3 id="post_author">
                <img id="post_user_image" src={user}></img>
                {post.postData.author}
            </h3>
            <h3 id="post_title">{post.postData.title}</h3>
            <audio src={post.audioURL} controls></audio>

            <div id="post_description">
                Description: <p>{post.postData.description}</p>
            </div>
            <div id="post_stats">
                {date.toLocaleString("en-US")}
                <div id="viewsLikes">
                    <img src={listens} alt="listens"></img>
                    {post.postData.views} <img onClick={toggleLike} id="post_like_icon" src={like} alt="listens"></img>
                    {post.postData.likes}
                </div>
            </div>
        </div>
    );
}
