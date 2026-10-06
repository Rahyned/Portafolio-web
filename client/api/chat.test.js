import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "node:events";

const ORIGIN = "http://localhost:5173";

function createRes() {
  const res = {
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
    },
    writeHead() {},
    write() {},
    end() {}
  };
  return res;
}

function createReq(overrides = {}) {
  const req = new EventEmitter();
  req.method = "POST";
  req.headers = {
    origin: ORIGIN,
    "x-forwarded-for": "203.0.113.11",
    ...overrides.headers
  };
  req.body = {
    messages: [{ role: "user", content: "Hola" }],
    lang: "es",
    ...overrides.body
  };
  return req;
}

describe("api/chat.js", () => {
  let handler;

  beforeEach(async () => {
    vi.resetModules();
    process.env = { NODE_ENV: "test" };
    delete process.env.VERCEL_ENV;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.LLM_BASE_URL;
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_MODEL;
    handler = (await import("./chat.js")).default;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("403 sin Origin", async () => {
    const res = createRes();
    const req = createReq();
    delete req.headers.origin;
    await handler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("400 por body inválido", async () => {
    const res = createRes();
    await handler(createReq({ body: { lang: "fr", messages: [] } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("503 sin LLM", async () => {
    const res = createRes();
    await handler(createReq(), res);
    expect(res.statusCode).toBe(503);
  });

  it("503 en producción sin Upstash", async () => {
    process.env.VERCEL_ENV = "production";
    process.env.LLM_BASE_URL = "https://llm.test/v1";
    process.env.LLM_API_KEY = "key";
    process.env.LLM_MODEL = "model";
    vi.resetModules();
    handler = (await import("./chat.js")).default;

    const res = createRes();
    await handler(createReq(), res);
    expect(res.statusCode).toBe(503);
  });

  it("max_tokens enviado = 700", async () => {
    process.env.LLM_BASE_URL = "https://llm.test/v1";
    process.env.LLM_API_KEY = "key";
    process.env.LLM_MODEL = "model";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader() {
          return {
            async read() {
              return { done: true };
            }
          };
        }
      }
    });
    vi.stubGlobal("fetch", fetchMock);

    vi.resetModules();
    handler = (await import("./chat.js")).default;

    const res = createRes();
    await handler(createReq(), res);

    expect(fetchMock).toHaveBeenCalled();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.max_tokens).toBe(700);
  });
});
