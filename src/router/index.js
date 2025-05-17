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
import Layout from "../layouts/Layout";
import OtherPayments from "../pages/OtherPayments/OtherPayments";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout><Dashboard /></Layout>,
        errorElement: <Layout><Dashboard /></Layout>,
    },
    {
        path: "categories",
        element: <Layout><Categories /></Layout>,
    },
    {
        path: "events",
        element: <Layout><Events /></Layout>,
    },
    {
        path: "payments",
        element: <Layout><Payments /></Layout>,
    },
    {
        path: "other-payments",
        element: <Layout><OtherPayments /></Layout>,
    },
    {
        path: "contributions",
        element: <Layout><Contributions /></Layout>,
    },
    {
        path: "accounting",
        element: <Layout><Accounting /></Layout>,
    },
    {
        path: "users",
        element: <Layout><Users /></Layout>,
    },
    {
        path: "regions",
        element: <Layout><Regions /></Layout>,
    },
    {
        path: "dekania",
        element: <Layout><Dekania /></Layout>,
    },
    {
        path: "wallet",
        element: <Layout><Wallet /></Layout>,
    },
    {
        path: "profile",
        element: <Layout><Profile /></Layout>,
    },
    {
        path: "settings",
        element: <Layout><Settings /></Layout>,
    },
    {
        path: "login",
        element: <Login />,
    }
]);