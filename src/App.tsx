import {Routes, Route} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ErrorPage from "./pages/ErrorPage"

import IconsProvider from "./contexts/Icons"
import DatabaseProvider from "./contexts/Database"

import AuthLayout from "./components/AuthLayout"

import "./assets/App.css"

function App() {

  return <IconsProvider>
    <DatabaseProvider>
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
          element={<Login />}
        />
        <Route 
          path="/register"
          element={<Register />}
        />
        <Route 
          path="/*"
          element={<ErrorPage />}
        />
      </Routes>
    </DatabaseProvider>
  </IconsProvider>
  
}

export default App
