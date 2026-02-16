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
import AllUsers from "../pages/dashboard/AllUser";
import AdminHome from "../pages/dashboard/AdminHome";
import AddItem from "../pages/dashboard/AddItems";
import ManageItems from "../pages/dashboard/ManageItems";
import UpdateItem from "../pages/dashboard/UpdateItem";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Using element consistently
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
      // User Routes
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'userHome',
        element: <div>User Home Content</div> // Replace with your component
      },
      // Admin Routes (Available to see for now as requested)
      {
        path: 'users',
        element: <AllUsers />
      },
      {
        path: 'adminHome',
        element: <AdminHome></AdminHome>
      },
      {
        path: 'addItems',
        element: <AddItem></AddItem>
      },
      {
        path: 'manageItems',
        element: <ManageItems></ManageItems>
      },
      {
        path: "updateItem/:id",
        element: <UpdateItem />,
        loader: ({ params }) => fetch(`http://localhost:5000/menu/${params.id}`)
      },
      {
        path: 'bookings',
        element: <div>Manage Bookings Content</div> // Replace with your component
      }
    ]
  }
]);