import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
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
import ProtectedRoute from './components/ProtectedRoute'
import PrivacyPolicy from './components/Legal/PrivacyPolicy.jsx'
import TermsAndConditions from './components/Legal/TermsAndConditions.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='future-projects' element={<FutureProjects />} />
        <Route path='gallery' element={<Gallery />} />
        <Route path='admin' element={<Login />} />
        <Route path='privacy-policy' element={<PrivacyPolicy />} />
        <Route path='terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
