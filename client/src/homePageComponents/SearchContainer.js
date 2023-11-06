export default function SearchContainer({ toSearchView }) {
    return (
        <div onClick={toSearchView} id="searchContainer">
            <textarea placeholder="Search"></textarea>
        </div>
    );
}
