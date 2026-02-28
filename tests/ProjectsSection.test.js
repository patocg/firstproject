import { render, screen } from "@testing-library/react";
import ProjectsSection from "../components/sections/ProjectsSection";

jest.mock("next/dynamic", () => (importFn) => {
  const MockComponent = () => <div>ProjectsModal mock</div>;
  return MockComponent;
});

describe("ProjectsSection", () => {
  it("renderiza o texto de introdução dos projetos", () => {
    render(<ProjectsSection />);

    expect(
      screen.getByText(
        /confira os projetos que estou desenvolvendo atualmente com foco em tecnologia, inovação e impacto real/i
      )
    ).toBeInTheDocument();
  });

  it("carrega o componente ProjectsModal (mockado)", () => {
    render(<ProjectsSection />);

    expect(screen.getByText(/projectsmodal mock/i)).toBeInTheDocument();
  });
});
