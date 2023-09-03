import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageView from "./PageView";

function RouteList() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<>
                    <PageView />
                </>} />
                <Route path="/views/:viewname" element={<>
                    <PageView />
                </>} />
                <Route path="/views/:viewname/:id" element={<>
                    <PageView />
                </>} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouteList;