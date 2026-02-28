import { render, screen } from "@testing-library/react";
import SkillsSection from "../components/sections/SkillSection";

describe("SkillsSection", () => {
  it("renderiza o título 'Linguagens e Ferramentas'", () => {
    render(<SkillsSection />);

    expect(
      screen.getByText(/linguagens e ferramentas/i)
    ).toBeInTheDocument();
  });

  it("renderiza os títulos das categorias", () => {
    render(<SkillsSection />);

    expect(screen.getByText(/backend/i)).toBeInTheDocument();
    expect(screen.getByText(/frontend/i)).toBeInTheDocument();
    expect(screen.getByText(/devops & tools/i)).toBeInTheDocument();
    expect(screen.getByText(/ai tools/i)).toBeInTheDocument();
  });

  it("renderiza alguns ícones de skills principais pelo título", () => {
    render(<SkillsSection />);

    expect(screen.getByTitle(/python/i)).toBeInTheDocument();
    expect(screen.getByTitle(/flask/i)).toBeInTheDocument();
    expect(screen.getByTitle(/postgresql/i)).toBeInTheDocument();

    expect(screen.getByTitle(/html5/i)).toBeInTheDocument();
    expect(screen.getByTitle(/css3/i)).toBeInTheDocument();
    expect(screen.getByTitle(/javascript/i)).toBeInTheDocument();

    // match exato para não confundir com GitHub Copilot
    expect(screen.getByTitle(/^git$/i)).toBeInTheDocument();
    expect(screen.getByTitle(/vscode/i)).toBeInTheDocument();

    expect(screen.getByTitle(/gemini/i)).toBeInTheDocument();
    expect(screen.getByTitle(/openai \/ gpt/i)).toBeInTheDocument();
    expect(screen.getByTitle(/perplexity/i)).toBeInTheDocument();
    expect(screen.getByTitle(/grok/i)).toBeInTheDocument();
    expect(screen.getByTitle(/github copilot/i)).toBeInTheDocument();
  });
});
