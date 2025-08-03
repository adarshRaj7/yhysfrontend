import React from "react";
import {
  IconHome,
  IconUser,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const links = [
  {
    name: "My Purchases",
    to: "/dashboard",
    icon: <IconHome size={22} stroke={1.7} />,
  },
  {
    name: "Profile",
    to: "/dashboard/profile",
    icon: <IconUser size={22} stroke={1.7} />,
  },
  {
    name: "Settings",
    to: "/dashboard/settings",
    icon: <IconSettings size={22} stroke={1.7} />,
  },
];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="aceternity-sidebar aceternity-sidebar-modern">
      <div className="sidebar-header">
        <img src="/assets/logo.png" alt="Logo" className="sidebar-logo-img" />
        <span className="sidebar-logo-text">Your Home Your Style</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              clsx(
                "sidebar-link-modern",
                isActive && "sidebar-link-modern-active"
              )
            }
          >
            <span className="sidebar-icon-modern">{link.icon}</span>
            <span className="sidebar-link-text">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button
          className="sidebar-link-modern sidebar-logout-modern"
          onClick={onLogout}
        >
          <span className="sidebar-icon-modern">
            <IconLogout size={22} stroke={1.7} />
          </span>
          <span className="sidebar-link-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}
