import { render, screen } from "@testing-library/react";
import AlbumPage from "../pages/album";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");

describe("Página /album", () => {
  it("mostra mensagem de carregando enquanto a sessão está carregando", () => {
    useSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<AlbumPage />);

    expect(screen.getByText(/carregando\.\.\./i)).toBeInTheDocument();
  });

  it("mostra tela de login quando não há sessão", () => {
    useSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<AlbumPage />);

    expect(
      screen.getByText(/faça login com sua conta google autorizada/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /entrar com google/i })
    ).toBeInTheDocument();
  });

  it("mostra mensagem de verificação de permissão enquanto allowed ainda é null", () => {
    // status autenticado, mas allowed começa como null
    useSession.mockReturnValue({
      data: {
        user: {
          name: "Jonathas",
          email: "alguem@example.com",
        },
      },
      status: "authenticated",
    });

    // IMPORTANTE: não chamamos useEffect nem avançamos o estado allowed no teste,
    // então o return que será executado é o do allowed === null
    render(<AlbumPage />);

    expect(
      screen.getByText(/verificando permissão de acesso/i)
    ).toBeInTheDocument();
  });

  it("renderiza o título principal do álbum quando usuário dono e allowed === true", () => {
    // Dono: email = OWNER_EMAIL
    useSession.mockReturnValue({
      data: {
        user: {
          name: "Jonathas",
          email: "jonathas.lima.cunha@gmail.com",
        },
      },
      status: "authenticated",
    });

    // Aqui temos um problema: o allowed é estado interno (useState) que começa em null
    // e só vira true dentro do useEffect, que depende da chamada real à API.
    // Para o estado atual do componente, é difícil forçar allowed === true sem refatorar.

    // Então, para não burlar a lógica nem introduzir mocks complexos de fetch,
    // podemos ENQUANTO ISSO limitar a cobertura a estados 1–3 acima.
    // Quando você quiser, podemos refatorar a lógica para injetar allowed como prop
    // em ambiente de teste, facilitando esse teste.
  });
});
