import AppBar from "./AppBar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <AppBar />
      <Sidebar style={{ overflowY: "auto" }} />
      <div style={{ marginLeft: "200px", marginTop: "60px", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}