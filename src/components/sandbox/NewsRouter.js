import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import UserList from "../../views/sandbox/user-manage/UserList";
import RightList from "../../views/sandbox/right-manage/RightList";
import Home from "../../views/sandbox/home/Home";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import NewsDraft from "../../views/sandbox/news/NewsDraft";
import NewsAdd from "../../views/sandbox/news/NewsAdd";
import Audit from "../../views/sandbox/audit/Audit";
import AuditList from "../../views/sandbox/audit/AuditList";
import Unpublish from "../../views/sandbox/publish/Unpublish";
import Publish from "../../views/sandbox/publish/Publish";
import Sunset from "../../views/sandbox/publish/Sunset";
import NewsCategory from "../../views/sandbox/news/NewsCategory";
import Permission from "../../views/sandbox/permission/permission";
import axios from "axios";

const LocalRouteMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,

  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,

  "/news-manage/draft": <NewsDraft />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/category": <NewsCategory />,

  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,

  "/publish-manage/unpublished": <Unpublish />,
  "/publish-manage/published": <Publish />,
  "/publish-manage/sunset": <Sunset />,
};

export default function NewsRouter() {
  const [routeList, setRouteList] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then((res) => {
      setRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  const checkRoute = (item) => {
    return LocalRouteMap[item.key] !== null && item.pagepermisson === 1;
  };

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  const checkPermission = (item) => {
    return rights.includes(item.key);
  };

  return (
    <Routes>
      {routeList.map((item) => {
        if (checkRoute(item) && checkPermission(item)) {
          return (
            <Route
              path={item.key}
              key={item.key}
              element={LocalRouteMap[item.key]}
              exact
            />
          );
        }
        return null;
      })}
      <Route path="/" element={<Home />} exact></Route>
      <Route path="*" element={<Permission />} />
    </Routes>
  );
}
