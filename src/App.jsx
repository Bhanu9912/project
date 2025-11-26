import React from 'react'
import { RouterProvider } from 'react-router-dom'
import Routes from './Routes/Router.jsx'
import './App.css'
import{ Toaster } from 'react-hot-toast';
import MouseTrail from './Components/MouseTrail/MouseTrail.jsx';

const App = () => {
  return (
    <>
    <Toaster position='top-center'></Toaster>
  <div className='fixed z-9999'>
      <MouseTrail/>
  </div>
        <RouterProvider router={Routes}></RouterProvider>

    </>
  )
}

export default App

