export default function ErrorBox({ error }) {
    if (error != "") {
        return (
            <div id="error-box" className="error live">
                Error: {error}
            </div>
        );
    }
}
