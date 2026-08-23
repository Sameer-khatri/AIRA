import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { StatusCard, StatusType } from "./components/StatusCard";
import { fetchHealth, HealthResponse } from "./lib/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [connectionStatus, setConnectionStatus] = useState<StatusType>("loading");
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let intervalId: any;

    const checkHealth = async () => {
      try {
        const data = await fetchHealth();
        setHealthData(data);
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Backend offline:", error);
        setHealthData(null);
        setConnectionStatus("disconnected");
      }
    };

    // Run immediately on mount
    checkHealth();

    // Check periodically every 5 seconds
    intervalId = setInterval(checkHealth, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="view-container">
            <div className="section-header">
              <h2>Mission Control Dashboard</h2>
              <p>Observe the local agent status, database connectivity, and roadmap progress.</p>
            </div>

            <div className="dashboard-grid">
              <StatusCard
                title="Backend Status"
                value={
                  connectionStatus === "connected"
                    ? "CONNECTED"
                    : connectionStatus === "disconnected"
                    ? "OFFLINE"
                    : "CHECKING..."
                }
                status={connectionStatus}
                description={
                  connectionStatus === "connected"
                    ? `FastAPI service is running locally on 127.0.0.1:8000. Version: ${healthData?.version}`
                    : connectionStatus === "disconnected"
                    ? "Unable to connect to the backend server. Start the server using uvicorn."
                    : "Pinging the local service health check endpoint..."
                }
              />

              <StatusCard
                title="Local Mode"
                value={connectionStatus === "connected" && healthData?.mode ? healthData.mode.toUpperCase() : "LOCAL-FIRST"}
                status={connectionStatus === "connected" ? "connected" : "info"}
                description="AIRA is configured to run fully local-first. Core calculations, storage, and models operate on localhost."
              />

              <StatusCard
                title="Current Milestone"
                value="MILESTONE 0"
                status="info"
                description="Runnable Foundation. Running a local FastAPI backend and standalone React desktop environment connected over API."
              />

              <StatusCard
                title="Next Build Step"
                value="MILESTONE 1"
                status="info"
                description="Local Chat MVP. Integrating Ollama local models, streaming chat, routing core commands, and managing session histories."
              />
            </div>

            <div className="content-card" style={{ marginTop: "40px" }}>
              <h3>System Diagnostics</h3>
              <p>
                AIRA acts as your local personal workstation helper. Currently, the database is in the state:{" "}
                <span className="badge">
                  {connectionStatus === "connected" && healthData?.database ? healthData.database.toUpperCase() : "UNKNOWN"}
                </span>
                . If the database is connected, settings initialized automatically in the background.
              </p>
            </div>
          </div>
        );

      case "chat":
      case "projects":
      case "learning":
      case "roadmap":
      case "memory":
      case "settings":
        return (
          <div className="view-container">
            <div className="section-header">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
              <p>This capability is planned and will be built in a future sprint.</p>
            </div>
            <div className="content-card">
              <h3>Not Yet Implemented</h3>
              <p>
                This screen represents the placeholder space for the {activeTab} section. It will be implemented in subsequent milestones of the AIRA roadmap.
              </p>
              <span className="badge">Milestone 1+ Feature</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <header className="top-bar">
          <div className="page-title-container">
            <h1 className="page-title">AIRA Console</h1>
            <span className="page-subtitle">Local-first desktop AI companion</span>
          </div>
          <div className="top-bar-actions">
            <div className="connection-indicator">
              <span className={`connection-dot ${connectionStatus}`} />
              <span>
                {connectionStatus === "connected"
                  ? "SYSTEM ACTIVE"
                  : connectionStatus === "disconnected"
                  ? "SYSTEM OFFLINE"
                  : "ESTABLISHING..."}
              </span>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
    </>
  );
}
