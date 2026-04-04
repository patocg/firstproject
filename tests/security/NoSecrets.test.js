import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = path.resolve(__dirname, "../..");

function getAllJsFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", ".next", ".git"].includes(entry.name)
    ) {
      results.push(...getAllJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      results.push(fullPath);
    }
  }
  return results;
}

const apiFiles = getAllJsFiles(path.join(ROOT, "pages/api"));
const sourceFiles = [
  ...getAllJsFiles(path.join(ROOT, "pages")),
  ...getAllJsFiles(path.join(ROOT, "lib")),
  ...getAllJsFiles(path.join(ROOT, "components")),
];

describe("Segurança — Sem segredos hardcoded", () => {
  it("nenhum e-mail de owner hardcoded nos arquivos de API (deve usar process.env.OWNER_EMAIL)", () => {
    const ownerEmail = process.env.OWNER_EMAIL;
    if (!ownerEmail) return;

    for (const file of apiFiles) {
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toContain(ownerEmail);
    }
  });

  it("nenhuma AWS Access Key ID hardcoded nos arquivos fonte", () => {
    const AWS_KEY_PATTERN = /AKIA[A-Z0-9]{16}/;
    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, "utf-8");
      expect(AWS_KEY_PATTERN.test(content)).toBe(false);
    }
  });

  it(".env.local está coberto pelo .gitignore", () => {
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toMatch(/\.env\*\.local|\.env\.local/);
  });

  it(".env está coberto pelo .gitignore", () => {
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toMatch(/^\.env$/m);
  });

  it(".vercel está coberto pelo .gitignore", () => {
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toContain(".vercel");
  });

  it("node_modules está coberto pelo .gitignore", () => {
    const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
    expect(gitignore).toContain("node_modules");
  });

  it(".env.local não está rastreado pelo git", () => {
    const tracked = execSync("git ls-files .env.local", { cwd: ROOT })
      .toString()
      .trim();
    expect(tracked).toBe("");
  });

  it(".vercel não está rastreado pelo git", () => {
    const tracked = execSync("git ls-files .vercel", { cwd: ROOT })
      .toString()
      .trim();
    expect(tracked).toBe("");
  });

  it("variáveis sensíveis não usam prefixo NEXT_PUBLIC_", () => {
    const forbidden = [
      "NEXT_PUBLIC_AWS_SECRET",
      "NEXT_PUBLIC_AWS_ACCESS_KEY",
      "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET",
      "NEXT_PUBLIC_NEXTAUTH_SECRET",
      "NEXT_PUBLIC_OWNER_EMAIL",
    ];
    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, "utf-8");
      for (const key of forbidden) {
        expect(content).not.toContain(key);
      }
    }
  });
});
