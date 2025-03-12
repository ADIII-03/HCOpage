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


const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
<Route path='' element={<Home />}/>
<Route path='about' element={<About />}/>
    <Route path='contact' element={<Contact />} />
    <Route path='FutureProjects' element={<FutureProjects />}/>
    <Route path='Gallery' element={<Gallery />} />
    <Route path='*' element={<NotFound />}/>


    </Route>
    
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
