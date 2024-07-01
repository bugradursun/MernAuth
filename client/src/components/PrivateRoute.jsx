import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

//Outlet is used for childiren component which is declared in app.jsx
//so child component is profile route

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //currentUser exists => go to profile route, if not exists => go to sign in
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
