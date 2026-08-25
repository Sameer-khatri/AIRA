import { Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { ModelStatus } from "../lib/api";

interface TopCommandBarProps {
  activeTab: string;
  connectionStatus: "loading" | "connected" | "disconnected";
  modelStatus: ModelStatus | null;
  onNavigate: (tab: string) => void;
}

export default function TopCommandBar({
  activeTab,
  connectionStatus,
  modelStatus,
  onNavigate,
}: TopCommandBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isConnected = connectionStatus === "connected";
  const statusLabel = connectionStatus === "loading" ? "CHECKING" : isConnected ? "LOCAL" : "OFFLINE";
  const modelLabel = modelStatus?.default_model || "MODEL UNKNOWN";

  const navigate = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="command-bar">
      <button className="command-brand" type="button" onClick={() => navigate("home")} aria-label="Open AIRA Home">
        <span className="command-brand-mark"><span /></span>
        <span>AIRA</span>
      </button>

      <nav className={`command-nav ${mobileMenuOpen ? "command-nav-open" : ""}`} aria-label="Primary navigation">
        <button className={activeTab === "home" ? "active" : ""} type="button" onClick={() => navigate("home")}>Home</button>
        <button className={activeTab === "chat" ? "active" : ""} type="button" onClick={() => navigate("chat")}>Chat</button>
        <button className={activeTab === "projects" ? "active" : ""} type="button" onClick={() => navigate("projects")}>Projects</button>
      </nav>

      <div className="command-status">
        <span className={`command-status-dot ${connectionStatus}`} />
        <span>{statusLabel}</span>
        <span className="command-divider" />
        <span className="command-model">{modelLabel}</span>
        <button className="command-settings" type="button" onClick={() => navigate("settings")} aria-label="Open settings" title="Settings">
          <Settings size={16} />
        </button>
      </div>

      <button className="command-menu-button" type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  );
}
