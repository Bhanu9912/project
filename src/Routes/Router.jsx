


import Login from '../Components/Login/Login';
import Register from '../Components/Register/Register';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../Components/Users/Home/Home';
import AddFriends from '../Components/Users/Home/AddFriends';
import ProfilePage from '../Components/Users/Home/ProfilePage';
import Settings from '../Components/Users/Home/Settings';
import ProtectedRoute from "./ProtectedRoute";
import Layout from '../Components/Users/Home/Layout';

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
        <Layout>
           <Home />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/addfriends",
    element: (
      <ProtectedRoute>
        <Layout>
          <AddFriends />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
       <Layout>
           <ProfilePage /> 
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Layout>
           <Settings />
        </Layout>
      </ProtectedRoute>
    )
  }
]);

export default Routes;

