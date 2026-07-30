export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <h3 className="footer-brand">SlotSync</h3>

        <p className="footer-text">
          AI-Powered Interview Scheduling Platform
        </p>

        <div className="footer-links">
          <a href="mailto:barikrajesh8480@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/rajesh-barik-58b90a295" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://share.google/0KMXjCQ9hYuIyjjwH" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} SlotSync. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}