import { Outlet } from "react-router-dom"
import Nav from "./Nav/Nav"

const AuthLayout = () => {
  return <>
    <Nav />
    <Outlet />
  </>
}

export default AuthLayout
