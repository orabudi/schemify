import { FaLinkedin } from "react-icons/fa";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h3 className="about-title">About Schemify</h3>
        <img src="/logo.png" className="about-logo" />
        <p>
          Created by a cybersecurity professional with 5+ years of experience,
          Schemify was born out of a frustration with the lack of tools
          available to help developers identify and fix security issues in their
          JSON Schemas. As APIs become increasingly critical to modern
          applications, ensuring the security of your JSON Schemas is more
          important than ever. Schemify provides an easy-to-use interface to
          analyze your schemas for common security pitfalls and best practices,
          helping you catch vulnerabilities before they make it to production.
        </p>
        <p>You can find me and reach out on LinkedIn:</p>
        <div className="btn-linkedin-container">
          <a
            href="https://www.linkedin.com/in/or-abudi/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin className="btn-linkedin" />
          </a>
        </div>
      </div>
    </div>
  );
}
