export default function MyProfileContainer({ toProfileView, userInfo }) {
    return (
        <div onClick={toProfileView} id="myProfileContainer">
            <h3>Profile</h3>
            <h3>
                {userInfo.displayName} ({userInfo.username})
            </h3>
            <b>0 </b>posts
        </div>
    );
}
