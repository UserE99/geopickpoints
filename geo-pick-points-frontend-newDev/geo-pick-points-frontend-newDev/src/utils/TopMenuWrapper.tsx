import React from "react";
import { useLocation } from "react-router-dom";
import TopMenu from "./TopMenu";

const TopMenuWrapper = () => {
  const location = useLocation();

  // List of paths where the menu should not be displayed
  const hideMenuPaths = ["/map"];

  return !hideMenuPaths.includes(location.pathname) ? <TopMenu /> : null;
};

export default TopMenuWrapper;
