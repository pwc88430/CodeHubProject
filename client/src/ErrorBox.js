export default function ErrorBox({ error }) {
    if (error == "Account Created!") {
        return <div id="error-box-good">{error} Please log in!</div>;
    } else if (error != "") {
        return <div id="error-box-bad">Error: {error}</div>;
    }
}
