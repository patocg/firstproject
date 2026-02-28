import { render, screen } from "@testing-library/react";
import HeroSection from "../components/sections/HeroSection";

describe("HeroSection", () => {
  it("renderiza o título principal com o nome do Jonathas", () => {
    render(<HeroSection />);

    const title = screen.getByRole("heading", {
      name: /olá, eu sou jonathas cunha/i,
    });

    expect(title).toBeInTheDocument();
  });

  it("renderiza a descrição principal do hero", () => {
    render(<HeroSection />);

    const description = screen.getByText(
      /tecnologia, código e inovação fazem parte da minha trajetória/i
    );

    expect(description).toBeInTheDocument();
  });

  it("renderiza todos os links sociais esperados", () => {
    render(<HeroSection />);

    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    const instagram = screen.getByRole("link", { name: /instagram/i });
    const github = screen.getByRole("link", { name: /github/i });
    const facebook = screen.getByRole("link", { name: /facebook/i });

    expect(linkedin).toBeInTheDocument();
    expect(instagram).toBeInTheDocument();
    expect(github).toBeInTheDocument();
    expect(facebook).toBeInTheDocument();

    expect(linkedin).toHaveAttribute(
      "href",
      "https://linkedin.com/in/jonathas-lima-cunha-60070839/"
    );
    expect(instagram).toHaveAttribute(
      "href",
      "https://www.instagram.com/jonathas.cunha/"
    );
    expect(github).toHaveAttribute(
      "href",
      "https://github.com/patocg"
    );
    expect(facebook).toHaveAttribute(
      "href",
      "https://www.facebook.com/jonathas.cunha/"
    );
  });

  it("inclui a seção de álbum dentro do hero", () => {
    render(<HeroSection />);

    // este teste é propositalmente genérico, só garante que algo da AlbumSection aparece;
    // ajuste o texto abaixo se a AlbumSection tiver um título específico
    const albumText = screen.getByText(/álbum/i, { selector: "h2, h3, p, span" });

    expect(albumText).toBeInTheDocument();
  });
});
