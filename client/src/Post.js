import "./Post.css";

export default function Post({ post }) {
    return (
        <div id="post">
            <h4 id="title">{post.postData.title}</h4>
            <audio src={post.audioURL} controls></audio>
            <h3 id="author">{post.postData.author}</h3>
            <div>
                <div id="viewsLikes">
                    <h4 id="views">Views: {post.postData.views}</h4>
                    <h4 id="likes">Likes: {post.postData.likes}</h4>
                </div>
                <h4 id="date">{post.postData.dateCreated}</h4>
                Description: <p></p>
            </div>
        </div>
    );
}
