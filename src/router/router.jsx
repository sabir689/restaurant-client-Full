import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import AuthLayout from "../layouts/AuthLayOut";
import Menu from "../pages/menu/MEnu";
import Order from "../pages/order/Order";
import Contact from "../pages/contact/Contact";
import Dashboard from "../layouts/Dashboard";
import Cart from "../pages/dashboard/Cart";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute"; // Imported Admin Guard
import AllUsers from "../pages/dashboard/AllUser";
import AdminHome from "../pages/dashboard/AdminHome";
import AddItem from "../pages/dashboard/AddItems";
import ManageItems from "../pages/dashboard/ManageItems";
import UpdateItem from "../pages/dashboard/UpdateItem";
import Reservation from "../pages/dashboard/Reservation";
import MyBookings from "../pages/dashboard/MyBookings";
import AdminBookings from "../pages/dashboard/AdminBookings";
import UserHome from "../pages/dashboard/UserHome";
import AddReview from "../pages/dashboard/Addreview";
import Payment from "../pages/payment/Payment";
import PaymentHistory from "../pages/payment/PaymentHistory";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'menu',
                element: <Menu />
            },
            {
                path: 'order/:category',
                element: <Order />
            },
            {
                path: 'contact',
                element: <Contact />
            },
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: 'signIn',
                element: <SignIn />
            },
            {
                path: 'signUp',
                element: <SignUp />
            },
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: [
            // user
            {
                path: 'userHome',
                element: <UserHome />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'payment',
                element: <Payment />
            },
            {
                path: 'paymentHistory',
                element: <PaymentHistory />
            },
            {
                path: 'addReviews',
                element: <AddReview />
            },
            {
                path: 'myBookings',
                element: <MyBookings />
            },
            {
                path: 'reservation',
                element: <Reservation />
            },

            // admin
            {
                path: 'adminHome',
                element: <AdminRoute><AdminHome /></AdminRoute>
            },
            {
                path: 'users',
                element: <AdminRoute><AllUsers /></AdminRoute>
            },
            {
                path: 'addItems',
                element: <AdminRoute><AddItem /></AdminRoute>
            },
            {
                path: 'manageItems',
                element: <AdminRoute><ManageItems /></AdminRoute>
            },
            {
                path: 'bookings',
                element: <AdminRoute><AdminBookings /></AdminRoute>
            },
            {
                path: "updateItem/:id",
                element: <AdminRoute><UpdateItem /></AdminRoute>,
                loader: ({ params }) => fetch(`https://restaurant-server-eta.vercel.app/menu/${params.id}`)
            },
        ]
    }
]);