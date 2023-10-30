export default function MyProfileContainer({ toProfileView, userInfo }) {
    return (
        <div onClick={toProfileView} id="myProfileContainer">
            <h3>Profile</h3>
            <p>
                <b>
                    <h3>{userInfo.displayName} </h3>
                </b>
                ({userInfo.username})<b>0 </b>posts
            </p>
        </div>
    );
}
