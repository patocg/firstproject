import { render, screen, waitFor } from "@testing-library/react";
import AlbumPage from "../pages/album";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
    pathname: "/album",
  }),
}));

describe("Página /album", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("mostra mensagem de carregando enquanto a sessão está carregando", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(<AlbumPage />);
    expect(screen.getByText(/carregando\.\.\./i)).toBeInTheDocument();
  });

  it("mostra tela de login quando não há sessão", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<AlbumPage />);
    expect(
      screen.getByText(/faça login com sua conta google autorizada/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /entrar com google/i })
    ).toBeInTheDocument();
  });

  it("mostra mensagem de verificação de permissão enquanto allowed ainda é null", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Jonathas", email: "alguem@example.com" } },
      status: "authenticated",
    });
    global.fetch.mockReturnValue(new Promise(() => {})); // nunca resolve
    render(<AlbumPage />);
    expect(
      screen.getByText(/verificando permissão de acesso/i)
    ).toBeInTheDocument();
  });

  it("renderiza área administrativa quando usuário é o dono", async () => {
    useSession.mockReturnValue({
      data: { user: { name: "Jonathas", email: process.env.OWNER_EMAIL } },
      status: "authenticated",
    });

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ allowed: true, owner: true, permissions: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ albums: [] }),
      });

    render(<AlbumPage />);

    await waitFor(() => {
      expect(screen.getByText(/área administrativa/i)).toBeInTheDocument();
    });
  });
});
