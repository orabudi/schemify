import { SiGoogledocs } from "react-icons/si";

interface HeaderModalProps {
  setGetStartedOpen: () => void;
}

export default function HeaderModal({ setGetStartedOpen }: HeaderModalProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <img src="/logo.png" className="header-logo" />
        <div>
          <h1>Schemify</h1>
          <p>Schema security, simplified</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          className="btn btn-link"
          onClick={setGetStartedOpen}
          style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
        >
          <SiGoogledocs></SiGoogledocs>
          Get Started
        </button>
      </div>
    </header>
  );
}
