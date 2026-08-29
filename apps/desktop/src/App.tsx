import { lazy, Suspense, useEffect, useState } from "react";
import TopCommandBar from "./components/TopCommandBar";
import AiraPersonalHome from "./features/home/personal/AiraPersonalHome";
import {
  fetchHealth,
  fetchModelStatus,
  HealthResponse,
  ModelStatus,
} from "./lib/api";

const devPersonalHome = import.meta.env.DEV
  ? {
      id: "aira-personal-home" as const,
      path: "/lab/aira-personal-home",
      mainClass: "main-content-aira-personal-home",
      Component: lazy(() => import("./features/lab/aira-personal-home/AiraPersonalHomeLab")),
    }
  : null;

const devLabs = import.meta.env.DEV
  ? {
      chatSignal: lazy(() => import("./features/lab/chat-signal/ChatSignalLab")),
      livingHomeV2: lazy(() => import("./features/lab/living-home-v2/LivingHomeV2Lab")),
      airaCharacter: lazy(() => import("./features/lab/aira-character/AiraCharacterLab")),
    }
  : null;

type LabRoute = "chat-signal" | "living-home-v2" | "aira-character" | "aira-personal-home" | null;

function AppShell({ labRoute = null }: { labRoute?: LabRoute }) {
  const [activeTab, setActiveTab] = useState(labRoute === "chat-signal" ? "chat" : "home");
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);

  useEffect(() => {
    if (labRoute === devPersonalHome?.id) return;
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
  }, [labRoute]);

  useEffect(() => {
    if (labRoute === devPersonalHome?.id) return;
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
  }, [labRoute]);

  const renderContent = () => {
    if (labRoute === "chat-signal" && activeTab === "chat") {
      if (!devLabs) return null;
      const ChatSignalLab = devLabs.chatSignal;
      return <Suspense fallback={<div className="planned-page">Loading Chat Signal…</div>}><ChatSignalLab /></Suspense>;
    }

    if (labRoute === "living-home-v2" && activeTab === "home") {
      if (!devLabs) return null;
      const LivingHomeV2Lab = devLabs.livingHomeV2;
      return <Suspense fallback={<div className="planned-page">Loading Living Home…</div>}><LivingHomeV2Lab /></Suspense>;
    }

    if (labRoute === "aira-character" && activeTab === "home") {
      if (!devLabs) return null;
      const AiraCharacterLab = devLabs.airaCharacter;
      return <Suspense fallback={<div className="planned-page">Loading Character Lab…</div>}><AiraCharacterLab /></Suspense>;
    }

    if (devPersonalHome && labRoute === devPersonalHome.id && activeTab === "home") {
      const PersonalHome = devPersonalHome.Component;
      return <Suspense fallback={<div className="planned-page">Loading Personal Home…</div>}><PersonalHome /></Suspense>;
    }

    return <AiraPersonalHome health={healthData} modelStatus={modelStatus} connectionStatus={connectionStatus} />;
  };

  return (
    <div className="app-shell">
      {labRoute !== null && labRoute !== devPersonalHome?.id && (
        <TopCommandBar
          activeTab={activeTab}
          connectionStatus={connectionStatus}
          modelStatus={modelStatus}
          onNavigate={setActiveTab}
        />
      )}
      <main className={`main-content ${labRoute === null ? "main-content-aira-personal-home" : ""} ${labRoute === "chat-signal" && activeTab === "chat" ? "main-content-chat-signal" : ""} ${labRoute === "living-home-v2" && activeTab === "home" ? "main-content-living-v2" : ""} ${labRoute === "aira-character" && activeTab === "home" ? "main-content-aira-character" : ""} ${devPersonalHome && labRoute === devPersonalHome.id && activeTab === "home" ? devPersonalHome.mainClass : ""}`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname;
  const labRoute: LabRoute = import.meta.env.DEV
    ? path === "/lab/chat-signal"
      ? "chat-signal"
      : path === "/lab/living-home-v2"
        ? "living-home-v2"
        : path === "/lab/aira-character"
          ? "aira-character"
          : devPersonalHome && path === devPersonalHome.path
            ? devPersonalHome.id
            : null
    : null;
  return <AppShell labRoute={labRoute} />;
}
