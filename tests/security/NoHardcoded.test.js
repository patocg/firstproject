import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function scanDir(dir, ext = ".js") {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...scanDir(full, ext));
    else if (entry.name.endsWith(ext)) results.push(full);
  }
  return results;
}

describe("Segurança — Sem valores hardcoded no setup e arquivos de teste", () => {
  test("jest.setup.js não contém atribuições hardcoded de process.env com fallback", () => {
    const content = readFile(path.join(ROOT, "jest.setup.js"));
    // Detecta padrão: process.env.QUALQUER_COISA = ... || "valor"
    const hardcodedFallback = /process\.env\.\w+\s*=\s*.+\|\|/;
    expect(hardcodedFallback.test(content)).toBe(false);
  });

  test("jest.setup.js não contém endereços de e-mail", () => {
    const content = readFile(path.join(ROOT, "jest.setup.js"));
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    expect(emailPattern.test(content)).toBe(false);
  });

  test("jest.setup.js não contém padrão de AWS Access Key (AKIA...)", () => {
    const content = readFile(path.join(ROOT, "jest.setup.js"));
    expect(/AKIA[A-Z0-9]{16}/.test(content)).toBe(false);
  });

  test(".env.test existe para fornecer vars de ambiente nos testes", () => {
    expect(fs.existsSync(path.join(ROOT, ".env.test"))).toBe(true);
  });

  test(".env.test não contém AWS Access Key real (AKIA...)", () => {
    const content = readFile(path.join(ROOT, ".env.test"));
    expect(/AKIA[A-Z0-9]{16}/.test(content)).toBe(false);
  });

  test(".env.test não contém e-mail pessoal real (domínios conhecidos)", () => {
    const content = readFile(path.join(ROOT, ".env.test"));
    // Bloqueia domínios de e-mail pessoal reais — valores de teste devem usar @test.com
    const realEmailDomains = /@(gmail|hotmail|outlook|yahoo|live|icloud)\.com/i;
    expect(realEmailDomains.test(content)).toBe(false);
  });

  test("nenhum arquivo de teste contém e-mail com domínio pessoal hardcoded", () => {
    const realEmailDomains = /@(gmail|hotmail|outlook|yahoo|live|icloud)\.com/i;
    const testFiles = scanDir(path.join(ROOT, "tests"));
    const violations = testFiles.filter((file) =>
      realEmailDomains.test(readFile(file))
    );
    expect(violations).toEqual([]);
  });

  test("nenhum arquivo de teste (fora da pasta security) contém atribuição hardcoded de process.env com fallback", () => {
    const hardcodedFallback = /process\.env\.\w+\s*=\s*.+\|\|/;
    const allFiles = scanDir(path.join(ROOT, "tests"));
    // Exclui os próprios arquivos de segurança para evitar falso positivo com o padrão de regex
    const testFiles = allFiles.filter(
      (f) => !f.includes(path.join("tests", "security"))
    );
    const violations = testFiles.filter((file) =>
      hardcodedFallback.test(readFile(file))
    );
    expect(violations).toEqual([]);
  });
});
