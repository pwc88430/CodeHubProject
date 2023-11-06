export default function MyProfileContainer({ toProfileView, userInfo }) {
    return (
        <div onClick={toProfileView} id="myProfileContainer">
            <h3>Profile</h3>
            <h3>
                {userInfo.displayName} ({userInfo.username})
            </h3>
            <img src="../assets/Default-icon.jpeg" alt="profile picture" />
            <b>0 </b>posts
        </div>
    );
}
