import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router"
import Menu from './Components/Menu/Menu.jsx'
import Login from './Components/Login/Login.jsx'

const router = createBrowserRouter([
  { path: '/home', element: <App /> },
  { path: '/', element: <Menu /> },
  { path: '/login', element: <Login /> },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} >
  </RouterProvider>
)
