interface FooterModalProps {
  openAbout: () => void;
}

export default function FooterModal({ openAbout }: FooterModalProps) {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>
          <video
            autoPlay
            muted
            loop
            className="schemify-footer-video"
            src="/schemify-video.mp4"
          ></video>
        </span>
        <span className="footer-copyright">
          ©{new Date().getFullYear()} Schemify. All rights reserved.
        </span>

        <div>
          <button className="btn btn-link" onClick={openAbout}>
            About
          </button>
        </div>
      </div>
    </footer>
  );
}
