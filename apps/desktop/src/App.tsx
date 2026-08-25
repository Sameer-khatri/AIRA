import { useEffect, useState } from "react";
import ChatPage from "./features/chat/ChatPage";
import HomePage from "./features/home/HomePage";
import ProjectsPage from "./features/projects/ProjectsPage";
import TopCommandBar from "./components/TopCommandBar";
import {
  fetchHealth,
  fetchModelStatus,
  HealthResponse,
  ModelStatus,
} from "./lib/api";

function PlannedPage({ title }: { title: string }) {
  return (
    <div className="view-container planned-page">
      <div className="section-header">
        <span className="eyebrow">AIRA / PLANNED</span>
        <h2>{title}</h2>
        <p>This module is planned and is not active in the current build.</p>
      </div>
      <div className="planned-note">
        <span>Reserved for a later milestone.</span>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        const data = await fetchHealth();
        if (!mounted) return;
        setHealthData(data);
        setConnectionStatus("connected");
      } catch (error) {
        console.warn("Backend offline:", error);
        if (!mounted) return;
        setHealthData(null);
        setConnectionStatus("disconnected");
      }
    };

    checkHealth();
    const intervalId = window.setInterval(checkHealth, 5000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkModel = async () => {
      try {
        const data = await fetchModelStatus();
        if (mounted) setModelStatus(data);
      } catch (error) {
        console.warn("Model status unavailable:", error);
        if (mounted) setModelStatus(null);
      }
    };

    checkModel();
    const intervalId = window.setInterval(checkModel, 10000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomePage
            health={healthData}
            modelStatus={modelStatus}
            connectionStatus={connectionStatus}
            onNavigate={setActiveTab}
          />
        );
      case "chat":
        return <ChatPage />;
      case "projects":
        return <ProjectsPage />;
      case "settings":
        return <PlannedPage title="Settings" />;
      case "learning":
        return <PlannedPage title="Learning" />;
      case "roadmap":
        return <PlannedPage title="Roadmap" />;
      case "memory":
        return <PlannedPage title="Memory" />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <TopCommandBar
        activeTab={activeTab}
        connectionStatus={connectionStatus}
        modelStatus={modelStatus}
        onNavigate={setActiveTab}
      />
      <main className={`main-content ${activeTab === "home" ? "main-content-home" : ""}`}>
        {renderContent()}
      </main>
    </div>
  );
}
