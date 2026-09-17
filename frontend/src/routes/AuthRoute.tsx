import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthRoute;