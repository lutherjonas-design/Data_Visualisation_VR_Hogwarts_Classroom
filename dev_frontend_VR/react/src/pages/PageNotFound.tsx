import { useLocation } from "react-router-dom";

export default function PageNotFound() {
    const location = useLocation();

    // Construct full URL
    const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    return (<>
        <div className="text-2xl">PageNotFound</div>
        <div className="text-2l">{fullUrl}</div>
    </>)
}