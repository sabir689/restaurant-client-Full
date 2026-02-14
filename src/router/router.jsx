import {
    createBrowserRouter,
  } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";



  export const router = createBrowserRouter([
    {
      path: "/",
     Component:RootLayout,
     children:[
        {
            index:true,
            Component:Home
        }
     ]
       
      
    },
    
  ]);