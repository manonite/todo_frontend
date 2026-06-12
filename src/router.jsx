import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "./home.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import { authState } from "./home.jsx";

function ProtectedRoute() {
    if (!authState.token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

function PublicRoute() {
    if (authState.token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);