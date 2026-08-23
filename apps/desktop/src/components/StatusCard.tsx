import React from "react";

export type StatusType = "loading" | "connected" | "disconnected" | "info";

interface StatusCardProps {
  title: string;
  value: string;
  status: StatusType;
  description: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  status,
  description,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "#58E6A9"; // Green success
      case "disconnected":
        return "#FF6F91"; // Red danger
      case "loading":
        return "#55E6FF"; // Cyan loading
      case "info":
      default:
        return "#9B7CFF"; // Violet info
    }
  };

  const getPulseClass = () => {
    return status === "loading" ? "status-dot-pulse" : "";
  };

  return (
    <div className={`status-card status-${status}`}>
      <div className="status-card-header">
        <span className="status-card-title">{title}</span>
        <span
          className={`status-dot ${getPulseClass()}`}
          style={{ backgroundColor: getStatusColor() }}
        />
      </div>
      <div className="status-card-value" style={{ color: getStatusColor() }}>
        {value}
      </div>
      <div className="status-card-description">{description}</div>
    </div>
  );
};
