import tls from "tls";

/**
 * Minimal SMTP-over-implicit-TLS client (no dependency). Enough to send a single
 * HTML message through a provider's SMTP — e.g. Gmail (smtp.gmail.com:465) with
 * an App Password. Gmail itself is the sender, so DMARC passes without owning a
 * domain.
 */

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export interface SmtpMessage {
  from: string; // sender email (must match the authenticated account for Gmail)
  fromName?: string;
  to: string;
  subject: string;
  html: string;
}

export function sendSmtpMail(cfg: SmtpConfig, msg: SmtpMessage): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host });
    socket.setEncoding("utf8");
    socket.setTimeout(20000, () => fail(new Error("SMTP timeout")));

    let buffer = "";
    let expect: { code: number; next: () => void } | null = null;
    let settled = false;

    const fail = (e: Error) => {
      if (settled) return;
      settled = true;
      try { socket.destroy(); } catch { /* ignore */ }
      reject(e);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      try { socket.end(); } catch { /* ignore */ }
      resolve();
    };

    const send = (cmd: string) => socket.write(cmd + "\r\n");
    const step = (code: number, next: () => void) => { expect = { code, next }; };
    const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");

    socket.on("error", (e) => fail(e instanceof Error ? e : new Error(String(e))));

    socket.on("data", (chunk: string) => {
      buffer += chunk;
      let idx: number;
      while ((idx = buffer.indexOf("\r\n")) >= 0) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        // Final line of a (possibly multiline) reply: "250 ..." not "250-...".
        if (!/^\d{3} /.test(line)) continue;
        if (!expect) continue;
        const code = parseInt(line.slice(0, 3), 10);
        const e = expect;
        expect = null;
        if (code !== e.code) return fail(new Error(`SMTP: expected ${e.code}, got: ${line}`));
        e.next();
      }
    });

    const data =
      `From: ${msg.fromName ?? "JobCron"} <${msg.from}>\r\n` +
      `To: ${msg.to}\r\n` +
      `Subject: ${msg.subject}\r\n` +
      `MIME-Version: 1.0\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n` +
      `\r\n` +
      // CRLF line endings + dot-stuffing for SMTP DATA.
      msg.html.replace(/\r?\n/g, "\r\n").replace(/\r\n\./g, "\r\n..");

    // Protocol walk: greeting → EHLO → AUTH LOGIN → MAIL/RCPT/DATA → QUIT.
    step(220, () => {
      send(`EHLO ${cfg.host}`);
      step(250, () => {
        send("AUTH LOGIN");
        step(334, () => {
          send(b64(cfg.user));
          step(334, () => {
            send(b64(cfg.pass));
            step(235, () => {
              send(`MAIL FROM:<${msg.from}>`);
              step(250, () => {
                send(`RCPT TO:<${msg.to}>`);
                step(250, () => {
                  send("DATA");
                  step(354, () => {
                    socket.write(data + "\r\n.\r\n");
                    step(250, () => {
                      send("QUIT");
                      finish();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}
