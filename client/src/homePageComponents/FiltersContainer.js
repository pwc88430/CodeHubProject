import "./FiltersContainer.css";

export default function FiltersContainer() {
    function changeFilter(event) {
        const filterButtonEls = document.querySelectorAll(".filter");

        filterButtonEls.forEach((button) => button.classList.remove("liveFilter"));
        event.target.classList.add("liveFilter");
    }

    return (
        <div id="filters-container" onClick={changeFilter}>
            <div className="filter liveFilter">Recent</div>
            <div className="filter">Popular</div>
            <div className="filter">Recomended</div>
        </div>
    );
}
