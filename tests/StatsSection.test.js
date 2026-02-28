import { render, screen } from "@testing-library/react";
import StatsSection from "../components/sections/StatsSection";

describe("StatsSection", () => {
  it("renderiza o título de estatísticas e linguagens", () => {
    render(<StatsSection />);

    expect(
      screen.getByText(/estatisticas linguagens/i)
    ).toBeInTheDocument();
  });

  it("renderiza os títulos dos quatro cards de estatísticas", () => {
    render(<StatsSection />);

    expect(screen.getByText(/github stats/i)).toBeInTheDocument();
    expect(screen.getByText(/top languages/i)).toBeInTheDocument();
    expect(screen.getByText(/top repository/i)).toBeInTheDocument();
    expect(screen.getByText(/contributions/i)).toBeInTheDocument();
  });
});
