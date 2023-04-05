import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";

export default function IndexRouter() {
  localStorage.setItem("token", "xxxx")
  let isLogin = !(localStorage.getItem("token") === null)
  console.log(isLogin)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            isLogin ? (
              <NewsSandBox />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
