import { render, screen } from "@testing-library/react";
import AlbumDetailPage from "../pages/album/[albumCode]";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    query: { albumCode: "012025" },
    pathname: "/album/[albumCode]",
  }),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

describe("Página /album/[albumCode]", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("mostra mensagem de carregando enquanto a sessão está carregando", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(<AlbumDetailPage />);
    expect(screen.getByText(/carregando\.\.\./i)).toBeInTheDocument();
  });

  it("retorna null e redireciona quando não há sessão", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    const { container } = render(<AlbumDetailPage />);
    expect(container.firstChild).toBeNull();
  });

  it("mostra mensagem de verificação de permissão enquanto allowed ainda é null", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Jonathas", email: "alguem@example.com" } },
      status: "authenticated",
    });
    render(<AlbumDetailPage />);
    expect(
      screen.getByText(/verificando permissão de acesso/i)
    ).toBeInTheDocument();
  });
});
