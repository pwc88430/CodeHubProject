export default function DropDownMenu({ signOut }) {
    return (
        <div id="profileButtonExpanded">
            <button onClick={signOut} className="button">
                Sign Out
            </button>
            <button className="button">My Posts</button>
        </div>
    );
}
