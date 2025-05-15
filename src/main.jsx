import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import FutureProjects from './components/FutureProjects/FutureProjects.jsx'
import Gallery from './components/Gallery/Gallery.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import NotFound from './components/NotFound/NotFound.jsx'
import Login from "./components/Admin/Login";
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
      <Route path='FutureProjects' element={<FutureProjects />} />
      <Route path='Gallery' element={<Gallery />} />
      <Route path='admin/login' element={<Login />} />
      <Route
        path='admin/*'
        element={
          <PrivateRoute adminOnly>
            {/* Add your admin dashboard component here */}
            <div>Admin Dashboard</div>
          </PrivateRoute>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

// Create a root component to properly handle providers
const Root = () => {
  return (
    <RouterProvider router={router} />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App>
        <Root />
      </App>
    </AuthProvider>
  </React.StrictMode>
);
