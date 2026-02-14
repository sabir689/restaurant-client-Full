import {
    createBrowserRouter,
  } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import AuthLayout from "../layouts/AuthLayOut";



  export const router = createBrowserRouter([
    {
      path: "/",
     Component:RootLayout,
     children:[
        {
            index:true,
            Component:Home
        },
        
     ]
       
      
    },
    {
      path:'/',
      Component:AuthLayout,
      children:[
        {
          path: 'signIn',
          element: <SignIn></SignIn>
        },
        {
          path: 'signUp',
          element: <SignUp></SignUp>
        },
      ]
    }
    
  ]);