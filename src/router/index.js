import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import Events from "../pages/Events/Events";
import Payments from "../pages/Payments/Payments";
import Users from "../pages/Users/Users";
import Wallet from "../pages/Wallet/Wallet";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Categories from "../pages/Categories/Categories";
import Dekania from "../pages/Dekania/Dekania";
import Regions from "../pages/Regions/Regions";
import Contributions from "../pages/Contributions/Contributions";
import Accounting from "../pages/accounting/Accounting";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
        errorElement: <Dashboard />,
    },
    {
        path: "categories",
        element: <Categories />,
    },
    {
        path: "events",
        element: <Events />,
    },
    {
        path: "payments",
        element: <Payments />,
    },
    {
        path: "contributions",
        element: <Contributions />,
    },
    {
        path: "accounting",
        element: <Accounting />,
    },
    {
        path: "users",
        element: <Users />,
    },
    {
        path: "regions",
        element: <Regions />,
    },
    {
        path: "dekania",
        element: <Dekania />,
    },
    {
        path: "wallet",
        element: <Wallet />,
    },
    {
        path: "profile",
        element: <Profile />,
    },
    {
        path: "settings",
        element: <Settings />,
    },
    {
        path: "login",
        element: <Login />,
    }
]);