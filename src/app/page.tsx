export const dynamic = "force-static";

/** Minimal landing/health page. Operational endpoints live under /api. */
export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", lineHeight: 1.6 }}>
      <h1>RSS Cron Service</h1>
      <p>Status: running.</p>
      <ul>
        <li>
          <code>POST /api/jobs</code> — protected cron trigger (bearer secret)
        </li>
        <li>
          <code>GET /api/v1/analytics</code> — public processed RSS insights
        </li>
      </ul>
    </main>
  );
}
