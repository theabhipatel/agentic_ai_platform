import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatHome from "./pages/ChatHome";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<AuthRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<ChatHome />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes

