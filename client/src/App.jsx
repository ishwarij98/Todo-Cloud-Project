import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/public/Register'
import Login from './pages/public/Login'
import Home from './pages/private/Home'
import Password from './pages/public/Password'
import Profile from './pages/private/Profile'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          {/* Private Route */}
          <Route path='/home' element={<Home />} />
          <Route path='/forgot' element={<Password />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
