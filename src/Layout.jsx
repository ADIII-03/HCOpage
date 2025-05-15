import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import App from './App'

export default function Layout() {
  return (
    <App>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </App>
  )
}
