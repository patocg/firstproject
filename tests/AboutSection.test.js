import { render, screen } from "@testing-library/react";
import AboutSection from "../components/sections/AboutSection";

describe("AboutSection", () => {
  it("renderiza o título 'Sobre mim'", () => {
    render(<AboutSection />);

    const title = screen.getByText(/sobre mim/i);
    expect(title).toBeInTheDocument();
  });

  it("renderiza o parágrafo principal sobre projetos de automação e inovação", () => {
    render(<AboutSection />);

    expect(
      screen.getByText(/projetos focados em automação, inovação e integração/i)
    ).toBeInTheDocument();
  });

  it("menciona missão, experiência e aprendizado contínuo", () => {
    render(<AboutSection />);

    // Testa os rótulos em <strong>
    expect(screen.getByText(/missão:/i)).toBeInTheDocument();
    expect(screen.getByText(/experiência:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/aprendizado contínuo e autêntico:/i)
    ).toBeInTheDocument();

    // Testa um pedaço dos textos descritivos
    expect(
      screen.getByText(/transformar desafios em soluções digitais/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/projetos envolvendo python, infraestrutura de redes/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sempre testando novas ferramentas, frameworks e boas práticas/i)
    ).toBeInTheDocument();
  });
});
