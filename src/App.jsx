import React from 'react'
import { RouterProvider } from 'react-router-dom'
import Routes from './Routes/Router.jsx'
import './App.css'
import{ Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
    <Toaster position='top-center'></Toaster>
        <RouterProvider router={Routes}></RouterProvider>
    </>
  )
}

export default App

