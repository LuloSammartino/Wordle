import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router"
import Menu from './Components/Menu/Menu.jsx'

const router = createBrowserRouter([
  {path: '/home', element: <App />},
  {path: '/', element: <Menu />}
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} >
    <App />
    </RouterProvider>
)
