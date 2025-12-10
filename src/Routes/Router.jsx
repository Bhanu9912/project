   
// import Login from '../Components/Login/Login';
// import Register from '../Components/Register/Register';
// import { createBrowserRouter } from 'react-router-dom';
// import Home from '../Components/Users/Home/Home';
// import AddFriends from '../Components/Users/Home/AddFriends';
// import ProfilePage from '../Components/Users/Home/ProfilePage';
// import Settings from '../Components/Users/Home/Settings';
// import ProtectedRoute from "./ProtectedRoute";


// // import Home from '../Components/Home/Home';

// let Routes= createBrowserRouter([
//     {
//     path :"/register",
//     element: <Register/> 
//    },
//    {
//     path :"/",
//     element: <Login/>
//    },
//    {
//    path:"/home",
//    element:(
//       <ProtectedRoute>
//       <Home />
//     </ProtectedRoute>
    
//    )
//     },
//     {
//     path:"/addfriends",
//     element:<AddFriends/>
//     },
//     {
//     path:"/profile",
//     element:<ProfilePage/>
//     },
//     {
//     path:"/settings",
//     element:<Settings/>
//     },

   
    

// ])

// export default Routes;


import Login from '../Components/Login/Login';
import Register from '../Components/Register/Register';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../Components/Users/Home/Home';
import AddFriends from '../Components/Users/Home/AddFriends';
import ProfilePage from '../Components/Users/Home/ProfilePage';
import Settings from '../Components/Users/Home/Settings';
import ProtectedRoute from "./ProtectedRoute";

let Routes = createBrowserRouter([
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: "/addfriends",
    element: (
      <ProtectedRoute>
        <AddFriends />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  }
]);

export default Routes;

