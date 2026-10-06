import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { normalizeContactSubjectName } from "../src/shared/contactSchema.js";

const sendMail = vi.hoisted(() => vi.fn().mockResolvedValue({}));
const createTransport = vi.hoisted(() => vi.fn(() => ({ sendMail })));

vi.mock("nodemailer", () => ({
  default: { createTransport }
}));

const ORIGIN = "http://localhost:5173";

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

let ipSeq = 0;

function createReq(overrides = {}) {
  ipSeq += 1;
  return {
    method: "POST",
    headers: {
      origin: ORIGIN,
      "x-forwarded-for": overrides.ip || `203.0.113.${ipSeq}`,
      ...overrides.headers
    },
    body: {
      name: "Ana Test",
      email: "ana@example.com",
      type: "web",
      timeline: "flexible",
      budget: "small",
      details: "Detalle válido del proyecto.",
      company: "",
      ...overrides.body
    }
  };
}

function validSmtpEnv() {
  process.env.SMTP_HOST = "smtp.test";
  process.env.SMTP_USER = "user@test";
  process.env.SMTP_PASS = "pass";
  process.env.CONTACT_EMAIL = "dest@test";
}

describe("normalizeContactSubjectName", () => {
  it("quita caracteres de control y trunca a 80", () => {
    const raw = "A\u0001" + "b".repeat(90);
    expect(normalizeContactSubjectName(raw)).toHaveLength(80);
    expect(normalizeContactSubjectName(raw)).toBe("Ab" + "b".repeat(78));
  });
});

describe("api/contact.js", () => {
  let handler;

  beforeEach(async () => {
    ipSeq = 0;
    vi.resetModules();
    sendMail.mockClear();
    createTransport.mockClear();
    process.env = { NODE_ENV: "test" };
    validSmtpEnv();
    handler = (await import("./contact.js")).default;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("405 en GET", async () => {
    const res = createRes();
    await handler({ method: "GET", headers: { origin: ORIGIN } }, res);
    expect(res.statusCode).toBe(405);
  });

  it("403 sin Origin u Origin ajeno", async () => {
    const res1 = createRes();
    const req1 = createReq();
    delete req1.headers.origin;
    await handler(req1, res1);
    expect(res1.statusCode).toBe(403);

    const res2 = createRes();
    await handler(createReq({ headers: { origin: "https://evil.example" } }), res2);
    expect(res2.statusCode).toBe(403);
  });

  it("400 por campos inválidos", async () => {
    const res = createRes();
    await handler(createReq({ body: { budget: "huge" } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("budget");
  });

  it('acepta budget "small" y lo convierte a "Pequeño" en el email', async () => {
    const res = createRes();
    await handler(createReq(), res);
    expect(res.statusCode).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const mail = sendMail.mock.calls[0][0];
    expect(mail.text).toContain("Pequeño");
    expect(mail.html).toContain("Pequeño");
  });

  it('honeypot "company" → 200 sin enviar', async () => {
    const res = createRes();
    await handler(createReq({ body: { company: "Evil Corp" } }), res);
    expect(res.statusCode).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("503 sin SMTP", async () => {
    delete process.env.SMTP_HOST;
    vi.resetModules();
    handler = (await import("./contact.js")).default;
    const res = createRes();
    await handler(createReq(), res);
    expect(res.statusCode).toBe(503);
  });

  it("429 al repetir desde la misma IP", async () => {
    const res1 = createRes();
    await handler(createReq({ ip: "203.0.113.200" }), res1);
    expect(res1.statusCode).toBe(200);

    const res2 = createRes();
    await handler(createReq({ ip: "203.0.113.200" }), res2);
    expect(res2.statusCode).toBe(429);
  });

  it("asunto truncado y sin caracteres de control", async () => {
    const res = createRes();
    const longName = "X\u0007" + "Y".repeat(100);
    await handler(createReq({ body: { name: longName } }), res);
    expect(res.statusCode).toBe(200);
    const subject = sendMail.mock.calls[0][0].subject;
    expect(subject.includes("\u0007")).toBe(false);
    expect(subject.length).toBeLessThan(200);
    expect(subject).toContain("X" + "Y".repeat(78));
  });
});
