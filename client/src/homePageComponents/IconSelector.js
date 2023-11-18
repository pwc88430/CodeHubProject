export default function IconSelector() {
    let array = Array(50)
        .fill()
        .map((x, i) => i);

    const icons = array.map((number) => {
        let src = "/icons/Animals-avatar_" + (number + 1) + ".svg";
        console.log(src);
        return <img src={src}></img>;
    });

    return <div id="new_icon_container">{icons}</div>;
}
