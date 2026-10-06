import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(clientRoot, "package.json"), "utf8"));
const declared = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
]);

function walkApiJs(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name.startsWith("_")) out.push(...walkApiJs(full));
      else out.push(...walkApiJs(full));
    } else if (name.endsWith(".js") && !name.endsWith(".test.js")) {
      out.push(full);
    }
  }
  return out;
}

function externalPackages(source) {
  const found = new Set();
  const re = /from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("node:")) continue;
    const pkgName = spec.split("/")[0];
    found.add(pkgName);
  }
  return found;
}

describe("dependencias de client/api", () => {
  it("cada import de paquete está declarado en client/package.json", () => {
    const apiDir = join(clientRoot, "api");
    const files = walkApiJs(apiDir);
    const missing = [];

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const name of externalPackages(source)) {
        if (!declared.has(name)) {
          missing.push({ file, name });
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
