export default function IconSelector({ setIcon }) {
    function changeIcon(path) {
        setIcon(path);
        console.log(path);
    }

    let array = Array(50)
        .fill()
        .map((x, i) => i);

    const icons = array.map((number) => {
        let src = "/icons/Animals-avatar_" + (number + 1) + ".svg";
        return <img src={src} onClick={() => changeIcon(src)}></img>;
    });

    return <div id="new_icon_container">{icons}</div>;
}
