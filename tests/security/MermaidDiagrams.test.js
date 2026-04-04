import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());

// Lê todos os arquivos .md recursivamente (exceto node_modules)
function findMarkdownFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findMarkdownFiles(full));
    else if (entry.name.endsWith(".md")) results.push(full);
  }
  return results;
}

// Extrai todos os blocos ```mermaid ... ``` de um arquivo
function extractMermaidBlocks(content) {
  const blocks = [];
  const regex = /```mermaid\s*([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

// Detecta o tipo de diagrama Mermaid
function getDiagramType(block) {
  const firstLine = block.split("\n")[0].trim().toLowerCase();
  if (firstLine.startsWith("erdiagram")) return "erDiagram";
  if (firstLine.startsWith("sequencediagram")) return "sequenceDiagram";
  if (firstLine.startsWith("graph")) return "graph";
  if (firstLine.startsWith("flowchart")) return "flowchart";
  return "unknown";
}

describe("Documentação — Diagramas Mermaid válidos", () => {
  const mdFiles = findMarkdownFiles(ROOT);
  const allBlocks = [];

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const blocks = extractMermaidBlocks(content);
    for (const block of blocks) {
      allBlocks.push({ file: path.relative(ROOT, file), block });
    }
  }

  test("existem diagramas Mermaid nos arquivos de documentação", () => {
    expect(allBlocks.length).toBeGreaterThan(0);
  });

  test("erDiagram: sem chaves inválidas (apenas PK, FK, UK são aceitas)", () => {
    const invalidKeyPattern = /^\s+\w+\s+\w+\s+(SK|CK|GSI|LSI)\b/m;
    const violations = allBlocks
      .filter(({ block }) => getDiagramType(block) === "erDiagram")
      .filter(({ block }) => invalidKeyPattern.test(block))
      .map(({ file }) => file);

    expect(violations).toEqual([]);
  });

  test("erDiagram: atributos sem strings em aspas inline", () => {
    // strings em aspas inline em atributos causam erro de parse
    // ex: string reason "valor" → inválido
    const inlineStringInAttr = /^\s+\w+\s+\w+(\s+(PK|FK|UK))?\s+"[^"]+"/m;
    const violations = allBlocks
      .filter(({ block }) => getDiagramType(block) === "erDiagram")
      .filter(({ block }) => inlineStringInAttr.test(block))
      .map(({ file }) => file);

    expect(violations).toEqual([]);
  });

  test("todos os blocos Mermaid têm um tipo de diagrama declarado", () => {
    const violations = allBlocks
      .filter(({ block }) => getDiagramType(block) === "unknown")
      .map(({ file, block }) => `${file}: "${block.split("\n")[0].trim()}"`);

    expect(violations).toEqual([]);
  });

  test("nenhum bloco Mermaid está vazio", () => {
    const violations = allBlocks
      .filter(({ block }) => block.length === 0)
      .map(({ file }) => file);

    expect(violations).toEqual([]);
  });
});
