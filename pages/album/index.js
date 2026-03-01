// pages/album/index.js
// Página de "Lista de Álbuns".
// Responsabilidade principal:
// - Depois de autenticado (+ whitelist ou sendo o dono), listar álbuns.
// - Permitir navegar para cada álbum via /album/[albumCode].
// - Compartilhar o tema claro/escuro com a página de fotos.
// - Se o usuário logado for o dono (OWNER_EMAIL), abrir painel
//   administrativo em overlay para gerenciar a whitelist.

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function AlbumListPage() {
  const router = useRouter();

  // Sessão NextAuth (pode ser "loading", autenticado ou null).
  const { data: session, status } = useSession();

  // allowed === null  -> ainda checando whitelist
  // allowed === true  -> pode ver álbuns
  // allowed === false -> bloqueado (mas ainda pode ser o dono)
  const [allowed, setAllowed] = useState(null);

  // Tema compartilhado com a tela de álbum.
  const [theme, setTheme] = useState("light");

  // Lista de álbuns e estado de carregamento/erro da lista.
  const [albumList, setAlbumList] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [albumsError, setAlbumsError] = useState("");

  // Flag indicando se o usuário logado é o dono (controlada pelo backend)
  const [isOwner, setIsOwner] = useState(false);

  // ------------------------
  // ESTADO / LÓGICA DO PAINEL ADMIN (OVERLAY)
  // ------------------------

  // Controla se o painel administrativo está aberto.
  const [adminOpen, setAdminOpen] = useState(false);

  // Lista de entradas da whitelist (nome, email, flags de permissão, etc.).
  const [whitelist, setWhitelist] = useState([]);
  const [wlLoading, setWlLoading] = useState(false);
  const [wlError, setWlError] = useState("");

  // Formulário de novo usuário (nome + e-mail).
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Mensagem de feedback para ações de admin (sucesso/erro).
  const [adminMessage, setAdminMessage] = useState("");

  // Usuários selecionados na matriz (para exclusão em lote).
  const [selectedEmails, setSelectedEmails] = useState([]);

  // ------------------------
  // TEMA: leitura e persistência em localStorage
  // ------------------------

  // Ao montar, tenta ler o tema salvo no localStorage.
  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem("familyAlbumTheme")
          : null;
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    } catch (e) {
      console.error("Erro ao ler tema do localStorage", e);
    }
  }, []);

  // Alterna o tema e salva em localStorage.
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("familyAlbumTheme", next);
        }
      } catch (e) {
        console.error("Erro ao salvar tema no localStorage", e);
      }
      return next;
    });
  };

  // Estilo geral da página.
  const pageStyle = {
    padding: 32,
    minHeight: "100vh",
    backgroundColor: theme === "light" ? "#f3f4f6" : "#020617",
    color: theme === "light" ? "#111827" : "#e5e7eb",
    transition: "background-color 0.2s ease, color 0.2s ease",
  };

  // Estilo dos botões que representam cada álbum.
  const albumButtonStyle = (active) => ({
    padding: "12px 18px",
    borderRadius: 8,
    border: "1px solid #4b5563",
    background: active
      ? theme === "light"
        ? "#111827"
        : "#e5e7eb"
      : theme === "light"
        ? "#f9fafb"
        : "#020617",
    color: active
      ? theme === "light"
        ? "#f9fafb"
        : "#020617"
      : theme === "light"
        ? "#111827"
        : "#e5e7eb",
    cursor: "pointer",
    fontSize: "0.95rem",
    minWidth: 96,
  });

  // Estilos do switch de tema (Sol/Lua).
  const themeSwitchOuter = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  };
  const themeSwitchTrack = {
    width: 56,
    height: 28,
    borderRadius: 999,
    backgroundColor: theme === "light" ? "#e5e7eb" : "#020617",
    border: "1px solid #4b5563",
    position: "relative",
    transition: "background-color 0.2s ease",
  };
  const themeSwitchThumb = {
    position: "absolute",
    top: 2,
    left: theme === "light" ? 2 : 28,
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: theme === "light" ? "#facc15" : "#111827",
    boxShadow:
      theme === "light"
        ? "0 0 6px rgba(250, 204, 21, 0.8)"
        : "0 0 6px rgba(15, 23, 42, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    transition:
      "left 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
  };
  const themeIconLeft = "🌙";
  const themeIconRight = "☀️";

  // ------------------------
  // WHITELIST (área admin)
  // ------------------------

  // Busca a lista completa de whitelist na API (apenas se for dono).
  const fetchWhitelist = async () => {
    if (!isOwner) return;
    try {
      setWlLoading(true);
      setWlError("");
      const res = await fetch("/api/whitelist/list");
      if (!res.ok) {
        throw new Error("Falha ao carregar whitelist");
      }
      const data = await res.json();
      setWhitelist(data.items || []);
    } catch (err) {
      console.error(err);
      setWlError(err.message || "Erro ao carregar whitelist");
    } finally {
      setWlLoading(false);
    }
  };

  // Abre o overlay admin e carrega a whitelist.
  const openAdminPanel = () => {
    setAdminOpen(true);
    fetchWhitelist();
  };

  // Fecha o overlay admin.
  const closeAdminPanel = () => {
    setAdminOpen(false);
    setAdminMessage("");
    setWlError("");
    setSelectedEmails([]);
  };

  // Adiciona novo usuário (nome + e-mail) na whitelist.
  const handleAddWhitelist = async (e) => {
    e.preventDefault();
    setAdminMessage("");

    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setAdminMessage("Nome e e-mail são obrigatórios.");
      return;
    }

    try {
      const res = await fetch("/api/whitelist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Falha ao adicionar usuário na whitelist");
      }

      setAdminMessage("Usuário adicionado à whitelist com sucesso.");
      setNewName("");
      setNewEmail("");
      await fetchWhitelist();
    } catch (err) {
      console.error(err);
      setAdminMessage(err.message || "Erro ao adicionar usuário.");
    }
  };

  // Seleção de usuários na matriz (checkbox por linha).
  const toggleSelectEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  // Selecionar / desselecionar todos os usuários visíveis.
  const toggleSelectAll = () => {
    if (selectedEmails.length === whitelist.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(whitelist.map((entry) => entry.email));
    }
  };

  // Exclusão em lote: remove todos os e-mails selecionados.
  const deleteSelectedEmails = async () => {
    if (selectedEmails.length === 0) return;

    const msg =
      selectedEmails.length === 1
        ? `Remover ${selectedEmails[0]} da whitelist?`
        : `Remover ${selectedEmails.length} usuários da whitelist?`;

    if (!window.confirm(msg)) return;

    for (const email of selectedEmails) {
      await fetch("/api/whitelist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    }

    await fetchWhitelist();
    setSelectedEmails([]);
  };

  // ------------------------
  // WHITELIST (lado usuário comum) + lista de álbuns
  // ------------------------

  // Checa whitelist após autenticação.
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    const checkAccess = async () => {
      try {
        const res = await fetch("/api/whitelist/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await res.json();

        // backend diz se é dono ou não
        setIsOwner(!!data.owner);

        // dono sempre pode acessar, mesmo se allowed vier false
        setAllowed(data.allowed === true || data.owner === true);
      } catch (err) {
        console.error("Erro ao checar whitelist", err);
        setAllowed(false);
        setIsOwner(false);
      }
    };

    checkAccess();
  }, [status, session]);

  // Carrega a lista de álbuns quando whitelist OK ou se for o dono.
  useEffect(() => {
    if (status !== "authenticated") return;
    if (allowed !== true && !isOwner) return;

    const fetchAlbums = async () => {
      try {
        setLoadingAlbums(true);
        setAlbumsError("");
        const res = await fetch("/api/album/list-albums");
        if (!res.ok) throw new Error("Falha ao listar álbuns");
        const data = await res.json();
        setAlbumList(data.albums || []);
      } catch (err) {
        console.error(err);
        setAlbumsError(err.message || "Erro ao listar álbuns");
      } finally {
        setLoadingAlbums(false);
      }
    };

    fetchAlbums();
  }, [status, allowed, isOwner]);

  // ------------------------
  // GUARDAS DE INTERFACE (login/whitelist)
  // ------------------------

  if (status === "loading") {
    return <p style={{ padding: 32 }}>Carregando...</p>;
  }

  if (!session) {
    return (
      <div style={pageStyle}>
        <h1>📸 Álbum da Família</h1>
        <p style={{ marginBottom: 16 }}>
          Faça login com sua conta Google autorizada para ver os álbuns.
        </p>
        <button
          onClick={() => signIn("google")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#111827",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  if (allowed === null && !isOwner) {
    return <p style={{ padding: 32 }}>Verificando permissão de acesso...</p>;
  }

  if (!allowed && !isOwner) {
    const email = session.user?.email?.toLowerCase();
    const name = session.user?.name || "Usuário";

    return (
      <div style={pageStyle}>
        <h1>📸 Álbum da Família</h1>
        <p style={{ marginBottom: 12 }}>
          Olá, <strong>{name}</strong>. Este álbum é privado e o seu e-mail{" "}
          <strong>{email}</strong> ainda não foi autorizado para visualização.
        </p>
        <p style={{ marginBottom: 16, maxWidth: 520, fontSize: "0.95rem" }}>
          Para solicitar acesso, fale com o dono do álbum e informe o e-mail
          acima. Ele poderá adicionar você à lista de convidados (whitelist).
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#4b5563",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Sair
        </button>
      </div>
    );
  }

  // ------------------------
  // RENDERIZAÇÃO PRINCIPAL
  // ------------------------

  return (
    <div style={pageStyle}>
      {/* Header com usuário, tema, logout e botão para área admin (se dono). */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>📸 Álbum da Família</h1>

        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: theme === "light" ? "#6b7280" : "#d1d5db",
          }}
        >
          Logado como: {session.user?.name || "Usuário sem nome"} | e-mail:{" "}
          {session.user?.email?.toLowerCase()}
        </p>

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/",
              redirect: true,
            })
          }
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#4b5563",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Sair
        </button>

        {/* Switch de tema */}
        <div style={themeSwitchOuter} onClick={toggleTheme}>
          <span style={{ fontSize: 12 }}>
            {theme === "light" ? "Dia" : "Noite"}
          </span>
          <div style={themeSwitchTrack}>
            <div style={themeSwitchThumb}>
              {theme === "light" ? themeIconRight : themeIconLeft}
            </div>
          </div>
        </div>

        {/* Botão para abrir painel admin (somente dono). */}
        {isOwner && (
          <button
            onClick={openAdminPanel}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid #4b5563",
              cursor: "pointer",
              background: "transparent",
              color: theme === "light" ? "#111827" : "#e5e7eb",
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            Área administrativa
          </button>
        )}
      </div>

      {/* Lista de álbuns */}
      {loadingAlbums && <p>Carregando álbuns...</p>}
      {albumsError && <p style={{ color: "red" }}>{albumsError}</p>}
      {albumList.length === 0 && !loadingAlbums && !albumsError && (
        <p>Nenhum álbum encontrado ainda.</p>
      )}
      {albumList.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 12,
          }}
        >
          {albumList.map((code) => (
            <button
              key={code}
              onClick={() => router.push(`/album/${code}`)}
              style={albumButtonStyle(false)}
            >
              {code === "SEM-DATA" ? "Sem data" : code}
            </button>
          ))}
        </div>
      )}

      {/* OVERLAY ADMINISTRATIVO */}
      {isOwner && adminOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.70)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={closeAdminPanel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90vw",
              height: "90vh",
              maxWidth: "1600px",
              background: theme === "light" ? "#f9fafb" : "rgba(15,23,42,1)",
              borderRadius: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
              border: "1px solid rgba(148,163,184,0.6)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Cabeçalho do painel admin */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
                Área administrativa – Matriz de permissões
              </h2>
              <button
                onClick={closeAdminPanel}
                style={{
                  marginLeft: "auto",
                  border: "none",
                  background: "transparent",
                  color: theme === "light" ? "#111827" : "#e5e7eb",
                  cursor: "pointer",
                  fontSize: 22,
                  lineHeight: 1,
                }}
                aria-label="Fechar painel administrativo"
              >
                ✕
              </button>
            </div>

            {/* Texto explicativo */}
            <p
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: "0.9rem",
                color: theme === "light" ? "#4b5563" : "#9ca3af",
              }}
            >
              Cada coluna abaixo representa um tipo de permissão. Clique nas{" "}
              <strong>bolinhas de status</strong> para alternar entre ativo/inativo
              e nos botões <strong>Permitido/Bloqueado</strong> para ajustar
              acessos específicos.
            </p>

            {/* Formulário para adicionar novo usuário */}
            <form
              onSubmit={handleAddWhitelist}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <input
                type="text"
                placeholder="Nome completo"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #9ca3af",
                  minWidth: 180,
                }}
              />
              <input
                type="email"
                placeholder="E-mail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #9ca3af",
                  minWidth: 220,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: "#111827",
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                Adicionar à whitelist
              </button>
            </form>

            {/* Mensagens de feedback */}
            {adminMessage && (
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 8,
                  fontSize: "0.85rem",
                  color: "#16a34a",
                }}
              >
                {adminMessage}
              </p>
            )}
            {wlError && (
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 8,
                  fontSize: "0.85rem",
                  color: "#dc2626",
                }}
              >
                {wlError}
              </p>
            )}

            {/* Barra de ações da matriz: contador + excluir selecionados */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
                fontSize: "0.85rem",
              }}
            >
              <span>
                Selecionados: <strong>{selectedEmails.length}</strong>
              </span>
              <button
                type="button"
                onClick={deleteSelectedEmails}
                disabled={selectedEmails.length === 0}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #dc2626",
                  background:
                    selectedEmails.length === 0
                      ? "rgba(220,38,38,0.08)"
                      : "#dc2626",
                  color:
                    selectedEmails.length === 0 ? "#dc2626" : "#f9fafb",
                  fontSize: "0.8rem",
                  cursor:
                    selectedEmails.length === 0
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 500,
                }}
              >
                Excluir selecionados
              </button>
            </div>

            {/* Tabela / matriz de permissões */}
            <div
              style={{
                flex: 1,
                borderRadius: 8,
                overflow: "auto",
                border: "1px solid rgba(148, 163, 184, 0.6)",
              }}
            >
              {/* Cabeçalho da matriz com coluna de checkbox */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "0.5fr 1.8fr 2.2fr 1.5fr 1fr 1.4fr 1.4fr 1.4fr 1.6fr", // 9 colunas
                  gap: 8,
                  padding: "8px 12px",
                  background:
                    theme === "light" ? "#d1d5db" : "rgba(15,23,42,0.9)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                <span>
                  <input
                    type="checkbox"
                    checked={
                      whitelist.length > 0 &&
                      selectedEmails.length === whitelist.length
                    }
                    onChange={toggleSelectAll}
                  />
                </span>
                <span>Nome</span>
                <span>E-mail</span>
                <span>Último login</span>
                <span>Status</span>
                <span>Acesso aos álbuns</span>
                <span>Excluir fotos</span>
                <span>Upload</span>
                <span>Alteração cadastro</span>
              </div>

              {/* Corpo da tabela */}
              {wlLoading ? (
                <div style={{ padding: 12, fontSize: "0.9rem" }}>
                  Carregando whitelist...
                </div>
              ) : whitelist.length === 0 ? (
                <div style={{ padding: 12, fontSize: "0.9rem" }}>
                  Nenhum usuário na whitelist ainda.
                </div>
              ) : (
                whitelist.map((entry) => {
                  // Estilo base dos botões Permitido/Bloqueado
                  const permissionButtonStyle = (enabled) => ({
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: enabled
                      ? "1px solid #16a34a"
                      : "1px solid #dc2626",
                    background: enabled
                      ? "rgba(22,163,74,0.08)"
                      : "rgba(220,38,38,0.08)",
                    color: enabled ? "#16a34a" : "#dc2626",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    minWidth: 90,
                    textAlign: "center",
                  });

                  // Alterna ativo/inativo e ajusta permissões relacionadas
                  const toggleActiveLocal = async () => {
                    const nextIsActive = !entry.isActive;

                    // Se for desativar (bolinha vermelha), zera todos os acessos.
                    // Se for ativar (bolinha verde), garante apenas acesso aos álbuns.
                    const patch = nextIsActive
                      ? {
                        isActive: true,
                        canViewAlbums: true,
                        canUploadPhotos: false,
                        canDeletePhotos: false,
                        canEditProfile: false,
                      }
                      : {
                        isActive: false,
                        canViewAlbums: false,
                        canUploadPhotos: false,
                        canDeletePhotos: false,
                        canEditProfile: false,
                      };

                    await fetch("/api/whitelist/update", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: entry.email,
                        patch,
                      }),
                    });

                    fetchWhitelist();
                  };

                  // Alterna qualquer permissão booleana, respeitando regras de consistência
                  const togglePermissionLocal = async (fieldName) => {
                    // Valor atual e próximo valor do campo que foi clicado
                    const current = !!entry[fieldName];
                    const nextValue = !current;

                    // Começa com um patch simples só para o campo clicado
                    const patch = { [fieldName]: nextValue };

                    // Regras de negócio:

                    // 1) Se o campo clicado for "canViewAlbums":
                    //    - Se desligar, o usuário perde também isActive (bolinha vermelha)
                    //      e todos os outros acessos.
                    //    - Se ligar e o usuário estiver inativo, ativamos isActive.
                    if (fieldName === "canViewAlbums") {
                      if (!nextValue) {
                        // canViewAlbums = false  -> desativa tudo
                        patch.isActive = false;
                        patch.canUploadPhotos = false;
                        patch.canDeletePhotos = false;
                        patch.canEditProfile = false;
                      } else {
                        // canViewAlbums = true -> garante ativo
                        patch.isActive = true;
                      }
                    }

                    // 2) Para qualquer outra permissão (upload, excluir, editar),
                    //    se for ligar e o usuário estiver inativo, ativamos e
                    //    garantimos canViewAlbums = true, porque não faz sentido
                    //    ter upload/exclusão sem poder ver álbuns.
                    if (
                      ["canUploadPhotos", "canDeletePhotos", "canEditProfile"].includes(
                        fieldName
                      ) &&
                      nextValue === true &&
                      entry.isActive === false
                    ) {
                      patch.isActive = true;
                      patch.canViewAlbums = true;
                    }

                    await fetch("/api/whitelist/update", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: entry.email,
                        patch,
                      }),
                    });

                    fetchWhitelist();
                  };

                  const lastLogin = entry.lastLoginAt || "—";

                  return (
                    <div
                      key={entry.email}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "0.5fr 1.8fr 2.2fr 1.5fr 1fr 1.4fr 1.4fr 1.4fr 1.6fr",
                        gap: 8,
                        padding: "8px 12px",
                        fontSize: "0.9rem",
                        background:
                          theme === "light"
                            ? "#f9fafb"
                            : "rgba(15,23,42,0.7)",
                        borderTop: "1px solid rgba(148, 163, 184, 0.4)",
                        alignItems: "center",
                      }}
                    >
                      {/* Checkbox de seleção por usuário */}
                      <span>
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(entry.email)}
                          onChange={() =>
                            toggleSelectEmail(entry.email)
                          }
                        />
                      </span>

                      {/* Nome */}
                      <span>{entry.name}</span>

                      {/* E-mail */}
                      <span>{entry.email}</span>

                      {/* Último login */}
                      <span style={{ fontSize: "0.8rem" }}>
                        {lastLogin}
                      </span>

                      {/* Status ativo/inativo (bolinha) */}
                      <span>
                        <button
                          type="button"
                          onClick={toggleActiveLocal}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: "2px solid transparent",
                            backgroundColor: entry.isActive
                              ? "#22c55e"
                              : "#dc2626",
                            cursor: "pointer",
                          }}
                          aria-label={
                            entry.isActive
                              ? "Marcar como inativo"
                              : "Marcar como ativo"
                          }
                        />
                      </span>

                      {/* Acesso aos álbuns */}
                      <span>
                        <button
                          type="button"
                          onClick={() =>
                            togglePermissionLocal("canViewAlbums")
                          }
                          style={permissionButtonStyle(
                            entry.canViewAlbums
                          )}
                        >
                          {entry.canViewAlbums
                            ? "Permitido"
                            : "Bloqueado"}
                        </button>
                      </span>

                      {/* Excluir fotos */}
                      <span>
                        <button
                          type="button"
                          onClick={() =>
                            togglePermissionLocal("canDeletePhotos")
                          }
                          style={permissionButtonStyle(
                            entry.canDeletePhotos
                          )}
                        >
                          {entry.canDeletePhotos
                            ? "Permitido"
                            : "Bloqueado"}
                        </button>
                      </span>

                      {/* Upload */}
                      <span>
                        <button
                          type="button"
                          onClick={() =>
                            togglePermissionLocal("canUploadPhotos")
                          }
                          style={permissionButtonStyle(
                            entry.canUploadPhotos
                          )}
                        >
                          {entry.canUploadPhotos
                            ? "Permitido"
                            : "Bloqueado"}
                        </button>
                      </span>

                      {/* Alteração cadastro */}
                      <span>
                        <button
                          type="button"
                          onClick={() =>
                            togglePermissionLocal("canEditProfile")
                          }
                          style={permissionButtonStyle(
                            entry.canEditProfile
                          )}
                        >
                          {entry.canEditProfile
                            ? "Permitido"
                            : "Bloqueado"}
                        </button>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
