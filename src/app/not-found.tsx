import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(6rem, 15vw, 12rem)",
            fontWeight: 700,
            lineHeight: 1,
            color: "#ffd700",
            margin: 0,
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 500,
            color: "#fff",
            margin: "1rem 0",
            letterSpacing: "0.1em",
          }}
        >
          MISSION ABORTED
        </h2>
        <p
          style={{
            color: "#71717a",
            fontSize: "1rem",
            marginBottom: "2rem",
          }}
        >
          The target location doesn&apos;t exist or has been relocated.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.875rem 2rem",
            background: "#ffd700",
            color: "#000",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
