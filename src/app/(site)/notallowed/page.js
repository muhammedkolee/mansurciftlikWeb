export const metadata = {
  title: 'Under Construction',
  description:
    'Bu sayfa şu anda yapım aşamasındadır, lütfen ana menüye dönün.',
};

export default function NotAllowedPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0a0a0a;
          font-family: 'Syne', sans-serif;
          overflow: hidden;
        }

        :root {
          --yellow: #f5c842;
          --dark: #0a0a0a;
          --mid: #141414;
          --border: #222;
          --text: #e8e8e8;
          --muted: #555;
        }

        .page {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: var(--dark);
        }

        /* Animated grid background */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245, 200, 66, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 200, 66, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridShift 20s linear infinite;
        }

        @keyframes gridShift {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }

        /* Radial glow */
        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 200, 66, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Corner brackets */
        .corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: var(--yellow);
          border-style: solid;
          opacity: 0.4;
        }
        .corner-tl { top: 32px; left: 32px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 32px; right: 32px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 32px; left: 32px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 32px; right: 32px; border-width: 0 2px 2px 0; }

        /* Main content */
        .content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: fadeUp 0.8s ease forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Badge */
        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(245, 200, 66, 0.08);
          border: 1px solid rgba(245, 200, 66, 0.25);
          border-radius: 2px;
          padding: 6px 14px;
          margin-bottom: 40px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--yellow);
          text-transform: uppercase;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--yellow);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* Icon */
        .icon-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 32px;
        }

        .icon-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(245, 200, 66, 0.2);
          border-radius: 50%;
          animation: spinSlow 8s linear infinite;
        }

        .icon-ring::before {
          content: '';
          position: absolute;
          top: -3px;
          left: 50%;
          width: 6px;
          height: 6px;
          background: var(--yellow);
          border-radius: 50%;
          transform: translateX(-50%);
        }

        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }

        .icon-inner {
          position: absolute;
          inset: 12px;
          background: rgba(245, 200, 66, 0.08);
          border: 1px solid rgba(245, 200, 66, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        /* Heading */
        .heading {
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }

        .heading span {
          color: var(--yellow);
        }

        /* Subheading */
        .sub {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: var(--muted);
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        /* Description */
        .desc {
          font-size: 16px;
          color: #666;
          max-width: 380px;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        /* Progress bar */
        .progress-wrap {
          width: 280px;
          margin-bottom: 48px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .progress-track {
          height: 2px;
          background: var(--border);
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--yellow);
          width: 0%;
          animation: fillBar 2s ease 0.5s forwards;
        }

        @keyframes fillBar {
          to { width: 68%; }
        }

        /* Button */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--yellow);
          color: var(--dark);
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 14px 28px;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.15);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn:hover::before { opacity: 1; }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 200, 66, 0.25);
        }

        .btn:active { transform: translateY(0); }

        .btn-arrow {
          transition: transform 0.2s;
        }

        .btn:hover .btn-arrow {
          transform: translateX(-3px);
        }

        /* Bottom code tag */
        .code-tag {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }
      `}</style>

      <div className="page">
        <div className="grid-bg" />
        <div className="glow" />

        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        <div className="content">
          <div className="badge">
            <div className="badge-dot" />
            under constructıon
          </div>

          <div className="icon-wrap">
            <div className="icon-ring" />
            <div className="icon-inner">🔧</div>
          </div>

          <h1 className="heading">
            Yakında<span></span>
          </h1>
          <p className="sub">Bu sayfa şu anda yapım aşamasında.</p>

          <p className="desc">
            Bu sayfa üzerinde çalışıyoruz ve bu sayfaya girme izninizin olmadığı gözüküyor.
          </p>
        </div>

        <div className="code-tag">/* sayfa henüz tamamlanmadı */</div>
      </div>
    </>
  );
}