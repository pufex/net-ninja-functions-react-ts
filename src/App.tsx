import {Routes, Route} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

import IconsProvider from "./contexts/Icons"

import AuthLayout from "./components/AuthLayout"

import "./assets/App.css"

function App() {

  return <IconsProvider>
    <Routes>
      <Route 
        path="/"
        element={<AuthLayout />}
      >
        <Route 
          index
          element={<Home />}
        />
      </Route>
      <Route 
        path="/login"
        element={<Login/>}
      />
      <Route 
        path="/register"
        element={<Register/>}
      />
    </Routes>
  </IconsProvider>
  
}

export default App
