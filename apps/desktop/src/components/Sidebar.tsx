import React from "react";
import {
  Home,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Compass,
  Brain,
  Settings as SettingsIcon,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "learning", label: "Learning", icon: GraduationCap },
    { id: "roadmap", label: "Roadmap", icon: Compass },
    { id: "memory", label: "Memory", icon: Brain },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-logo">🌌</span>
        <span className="brand-name">AIRA</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar-placeholder">K</div>
          <div className="user-info">
            <span className="username">Karmbir</span>
            <span className="user-role">Host</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
