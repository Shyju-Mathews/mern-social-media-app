import React, { lazy, Suspense} from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
// import Home from "./scense/homePage/Home";
// import Login from "./scense/loginPage/Index";
// import Profile from "./scense/profilePage/Profile";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import { ToastContainer } from "react-toastify";

const Home = lazy(() => import('./scense/homePage/Home'));
const Login = lazy(() => import('./scense/loginPage/Index'));
const Profile = lazy(() => import('./scense/profilePage/Profile'));

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token))

  return (
    <div className="App">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Routes>
        <Route path='/' element={
            <Suspense fallback={<div />}>
              <Login />
            </Suspense>
          } />
          <Route path='/home' element={
            <Suspense fallback={<div />}>
              {isAuth ? <Home /> : <Navigate to="/" />}
            </Suspense>
          } />
          <Route path='/profile/:userId' element={
            <Suspense fallback={<div />}>
              {isAuth ? <Profile /> : <Navigate to="/" />}
            </Suspense>
          } />
            {/* <Route path="/" element={<Login />} />
            <Route
              path="/home" element={isAuth ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId" element={isAuth ? <Profile /> : <Navigate to="/" />}
            /> */}
          </Routes>
         </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;