import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

// ✅ Apenas este e-mail terá permissão de upload
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

export default function AlbumPage() {
  // ✅ sessão
  const { data: session, status } = useSession();

  // ✅ itens e estado atual
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Novo estado para saber se o usuário tem permissão (whitelist)
  const [allowed, setAllowed] = useState(null); // null = ainda verificando

  // ✅ lightbox
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ seleção
  const [selected, setSelected] = useState([]);

  // ✅ upload
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // ✅ novos estados para lista de álbuns e álbum selecionado
  const [albumList, setAlbumList] = useState([]);
  const [albumCode, setAlbumCode] = useState(null);

  // ✅ Lista de usuários na whitelist (apenas para o dono)
  const [whitelist, setWhitelist] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState("");

  // ✅ Flag para saber se o usuário logado é o dono do álbum
  const IS_OWNER =
    session?.user?.email &&
    session.user.email.toLowerCase() === OWNER_EMAIL.toLowerCase();

  // ✅ Função para buscar a lista de fotos do DynamoDB + S3 via API /api/album/list
  const fetchAlbum = async (code) => {
    if (!code) return;
    //limpa estado antes de carregar o novo álbum
    setItems([]);
    setSelected([]);

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/album/${code}`);
      if (!res.ok) {
        throw new Error("Falha ao carregar álbum");
      }

      const data = await res.json();
      const list = data.items || [];

      setItems(list);
      setSelected([]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao carregar álbum");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/album/list-albums");
      if (!res.ok) throw new Error("Falha ao listar álbuns");
      const data = await res.json();
      setAlbumList(data.albums || []);
    } catch (err) {
      console.error(err);
      // não precisa travar a página se falhar, só não mostra os cards
    }
  };

  // ✅ Carrega a whitelist completa (apenas se for dono)
  const fetchWhitelist = async () => {
    // Segurança extra no front: só tenta se for dono
    if (!IS_OWNER) return;

    try {
      setWhitelistLoading(true);
      setWhitelistError("");

      const res = await fetch("/api/whitelist/list");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Falha ao listar whitelist");
      }

      const data = await res.json();
      setWhitelist(data.items || []);
    } catch (err) {
      console.error(err);
      setWhitelistError(err.message || "Erro ao listar whitelist");
    } finally {
      setWhitelistLoading(false);
    }
  };

  // ✅ Adiciona/atualiza um email na whitelist
  const handleAddWhitelist = async (e) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      const res = await fetch("/api/whitelist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Falha ao adicionar na whitelist");
      }

      // Limpa campos do formulário
      setNewEmail("");
      setNewName("");

      // Recarrega lista de convidados
      await fetchWhitelist();
    } catch (err) {
      alert(err.message || "Erro ao adicionar na whitelist");
    }
  };

  // ✅ Revoga acesso de um email (remove da whitelist)
  const handleRemoveWhitelist = async (email) => {
    if (!window.confirm(`Revogar acesso de ${email}?`)) return;

    try {
      const res = await fetch("/api/whitelist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Falha ao remover da whitelist");
      }

      // Atualiza lista local sem precisar buscar de novo
      setWhitelist((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      alert(err.message || "Erro ao remover da whitelist");
    }
  };

  // Sempre que a sessão ficar "authenticated", checamos a whitelist
  useEffect(() => {
    // Se ainda não autenticou, não faz nada
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    // Função async interna para poder usar await
    const checkAccess = async () => {
      try {
        // Chama a rota protegida que consulta a tabela whitelist
        const res = await fetch("/api/whitelist/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await res.json();

        // Marca allowed como true/false conforme resposta da API
        setAllowed(data.allowed === true);
      } catch (err) {
        // Em caso de erro na API, por segurança bloqueia acesso
        console.error("Erro ao checar whitelist", err);
        setAllowed(false);
      }
    };

    checkAccess();
  }, [status, session]);

  // ✅ Quando dono autenticar, carrega whitelist para gerenciar convidados
  useEffect(() => {
    if (status === "authenticated" && IS_OWNER) {
      fetchWhitelist();
    }
  }, [status, IS_OWNER]);

  // ✅ Carrega a lista de álbuns sempre que a sessão estiver autenticadas
  useEffect(() => {
    if (status === "authenticated" && allowed === true) {
      fetchAlbums();
    }
  }, [status, allowed]);


  // // 1) Sessão ainda está carregando (NextAuth)
  if (status === "loading") {
    return <p style={{ padding: 32 }}>Carregando...</p>;
  }

  // 2) Usuário não está logado: mostra tela de login
  if (!session) {
    return (
      <div style={{ padding: 32 }}>
        <p>Faça login com sua conta Google autorizada para ver as fotos.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/album" })}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#111827",
            color: "#fff",
            fontWeight: 500,
            marginTop: 12,
          }}
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  // 3) Logado, mas ainda não terminamos de checar a whitelist
  if (allowed === null) {
    return (
      <p style={{ padding: 32 }}>
        Verificando permissão de acesso...
      </p>
    );
  }

  // 4) Logado, mas NÃO está na whitelist e não é o dono
  if (!allowed) {
    const email = session.user?.email?.toLowerCase();
    const name = session.user?.name || "Usuário";

    return (
      <div
        style={{
          padding: 32,
          maxWidth: 520,
          margin: "40px auto",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#f9fafb",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <h2 style={{ fontSize: "1.4rem", marginBottom: 8 }}>
          Acesso ainda não liberado
        </h2>

        <p style={{ marginBottom: 12, color: "#374151" }}>
          Olá, <strong>{name}</strong>. Este álbum é privado e o seu e-mail
          ainda não foi autorizado para visualização.
        </p>

        <div
          style={{
            padding: 10,
            borderRadius: 8,
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            marginBottom: 16,
            fontSize: "0.9rem",
            color: "#374151",
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            E-mail logado:
          </div>
          <div>{email}</div>
        </div>

        <p style={{ marginBottom: 16, fontSize: "0.9rem", color: "#4b5563" }}>
          Para solicitar acesso, fale com o dono do álbum e informe o e-mail
          acima. Ele poderá adicionar você à lista de convidados.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 8,
          }}
        >
          <button
            onClick={() =>
              signOut({
                callbackUrl: "/",
                redirect: true,
              })
            }
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
            Sair e trocar de conta
          </button>

          <button
            onClick={() => {
              alert(
                "Entre em contato com o dono do álbum e informe o e-mail exibido acima."
              );
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              cursor: "pointer",
              background: "#fff",
              color: "#111827",
              fontWeight: 500,
            }}
          >
            Entendi
          </button>
        </div>
      </div>
    );
  }

  // 5) Se chegou aqui: allowed === true → renderiza o álbum normalmente

  // ✅ Controles do lightbox
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? items.length - 1 : prev - 1
    );
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === items.length - 1 ? 0 : prev + 1
    );
  };

  // ✅ Marca/desmarca fotos selecionadas para download
  const toggleSelect = (key) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((f) => f !== key)
        : [...prev, key]
    );
  };

  // ✅ Download das fotos selecionadas usando Blob (funciona melhor com S3)
  const downloadSelected = async () => {
    const selectedItems = items.filter((item) =>
      selected.includes(item.key)
    );

    if (selectedItems.length === 0) return;

    for (const item of selectedItems) {
      try {
        const response = await fetch(item.url);
        if (!response.ok) {
          throw new Error("Falha ao baixar arquivo");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = item.key.split("/").pop() || "foto.jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao baixar", item.key, error);
        alert(`Erro ao baixar ${item.key}`);
      }
    }
  };

  // ✅ Excluir todas as fotos selecionadas (apenas para o dono)
  const deleteSelected = async () => {
    if (selected.length === 0) return;

    if (
      !window.confirm(
        `Tem certeza que deseja excluir ${selected.length} foto(s) selecionada(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(
        selected.map(async (key) => {
          const res = await fetch("/api/album/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key,              // s3Key: ex. "albuns/022015/01-01-2015_1.jpg"
              albumCode,        // ex. "022015" (do estado atual)
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Falha ao excluir a foto: ${key}`);
          }
        })
      );

      // Remove localmente as fotos já excluídas
      setItems((prev) => prev.filter((item) => !selected.includes(item.key)));
      setSelected([]);

      // força recarregar o álbum atual a partir da API (que já retorna [])
      if (albumCode) {
        await fetchAlbum(albumCode);
      }


      // 🔹 Se o álbum atual ficou sem fotos, limpa mensagens visuais
      setUploadMessage("");
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao excluir fotos");
    }
  };

  // Extrai albumCode (mmaaaa) e takenDate (yyyy-mm-dd) do nome do arquivo
  // Formatos suportados:
  // 1) dd-mm-aaaa[_x].ext
  // 2) _SEM-DATA_qualquer_coisa.ext  -> albumCode = "SEM-DATA"
  function parseFileName(fileName) {
    // Remove a extensão
    const base = fileName.split(".")[0]; // ex.: "27-02-2026_2" ou "_SEM-DATA_0001"

    // Caso especial: arquivos sem data
    if (base.startsWith("_SEM-DATA_")) {
      return {
        albumCode: "SEM-DATA",
        takenDate: null,
      };
    }

    // Caso normal: dd-mm-aaaa[_x]
    const datePart = base.split("_")[0]; // ex.: "27-02-2026"
    const parts = datePart.split("-");   // ["27", "02", "2026"]

    if (parts.length !== 3) {
      return { albumCode: null, takenDate: null };
    }

    const [dd, mm, yyyy] = parts;
    const albumCode = `${mm}${yyyy}`;        // "022026"
    const takenDate = `${yyyy}-${mm}-${dd}`; // "2026-02-27"

    return { albumCode, takenDate };
  }

  // ✅ Upload de novas fotos (agora aceita múltiplos arquivos)
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []); // converte FileList em array

    if (!files.length) return;

    setUploadMessage("");
    setUploading(true);

    try {
      // Vamos acumular quantos uploads deram certo
      let successCount = 0;
      let lastAlbumCode = albumCode || null;

      // Processa cada arquivo em sequência (mais simples para agora)
      for (const file of files) {
        // 1) Extrai albumCode e takenDate do nome do arquivo
        const { albumCode: codeFromName, takenDate } = parseFileName(file.name);

        if (!codeFromName) {
          console.error(
            `Nome inválido (${file.name}) — esperado dd-mm-aaaa[_x].ext`
          );
          continue; // pula esse arquivo e vai para o próximo
        }

        // Sempre derivar o albumCode do nome do arquivo (mmaaaa)
        const codeToUse = codeFromName;
        lastAlbumCode = codeToUse;

        // 2) Monta a chave no S3: albuns/mmaaaa/NOME_DO_ARQUIVO
        const s3Key = `albuns/${codeToUse}/${file.name}`;

        // 3) Pede URL de upload assinada para esse s3Key
        const res = await fetch("/api/album/upload-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            s3Key, // importante: mandamos o s3Key
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Erro ao gerar URL para", file.name, err);
          continue;
        }

        const { uploadUrl } = await res.json();

        // 4) Envia o arquivo direto para o S3
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file, // sem headers extras
        });

        if (!putRes.ok) {
          console.error("Erro ao enviar para S3:", file.name);
          continue;
        }

        // 5) Registra metadados no DynamoDB
        const addRes = await fetch("/api/album/add-photo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            albumCode: codeToUse,
            s3Key,
            takenDate,
          }),
        });

        if (!addRes.ok) {
          const err = await addRes.json().catch(() => ({}));
          console.error(
            "Erro ao salvar metadados no DynamoDB para",
            file.name,
            err
          );
          continue;
        }

        successCount += 1;
      }

      if (successCount > 0) {
        setUploadMessage(`Upload concluído (${successCount} arquivo(s)).`);

        // Se nenhum álbum estava selecionado, seleciona o último usado
        if (!albumCode && lastAlbumCode) {
          setAlbumCode(lastAlbumCode);
        }

        // Recarrega a lista de álbuns (caso tenha surgido álbum novo)
        await fetchAlbums();

        // Se temos um albumCode válido, recarrega as fotos dele
        if (lastAlbumCode) {
          await fetchAlbum(lastAlbumCode);
        }
      } else {
        setUploadMessage("Nenhum arquivo foi enviado (verifique os nomes).");
      }
    } catch (error) {
      console.error(error);
      setUploadMessage(`Erro: ${error.message}`);
    } finally {
      setUploading(false);
      event.target.value = ""; // libera para escolher novamente os mesmos arquivos
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1>📸 Álbum da Família</h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
        Logado como: {session.user?.name || "Usuário sem nome"} | email: {session.user?.email?.toLowerCase()} ||

        {/* Botão de sair, sempre visível para quem está logado */}
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/",      // volta para home
              redirect: true,        // força redirecionar imediatamente
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
      </p>

      {/* ✅ Painel de administração da whitelist - visível só para o dono */}
      {IS_OWNER && (
        <div
          style={{
            marginTop: 16,
            marginBottom: 24,
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: 8 }}>
            Gerenciar convidados (whitelist)
          </h2>

          {/* Formulário para adicionar/atualizar convidado */}
          <form
            onSubmit={handleAddWhitelist}
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <input
              type="text"
              placeholder="Nome (opcional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                flex: "1 1 160px",
              }}
            />
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                flex: "1 1 200px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
              }}
            >
              Adicionar / Atualizar
            </button>
          </form>

          {whitelistLoading && <p>Carregando whitelist...</p>}
          {whitelistError && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>
              {whitelistError}
            </p>
          )}

          {/* Lista de emails com botão de remover */}
          {whitelist.length > 0 ? (
            <ul style={{ marginTop: 8 }}>
              {whitelist.map((u) => (
                <li
                  key={u.email}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid #e5e7eb",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>
                    {u.name || "(sem nome)"} —{" "}
                    <strong>{u.email}</strong>
                  </span>
                  <button
                    onClick={() => handleRemoveWhitelist(u.email)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      background: "#dc2626",
                      color: "#fff",
                      fontSize: "0.8rem",
                    }}
                  >
                    Revogar acesso
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Nenhum convidado na whitelist ainda.
            </p>
          )}
        </div>
      )}

      {/* Lista de álbuns (meses) */}
      {albumList.length > 0 && (
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {albumList.map((code) => (
            <button
              key={code}
              onClick={() => {
                // limpa estado antes de carregar o novo álbum
                setAlbumCode(code);
                setItems([]);
                setSelected([]);
                setError("");
                fetchAlbum(code);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border:
                  code === albumCode
                    ? "2px solid #111827"
                    : "1px solid #d1d5db",
                background: code === albumCode ? "#111827" : "#f9fafb",
                color: code === albumCode ? "#fff" : "#111827",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {code}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Barra de ações: seleção, download e upload/excluir (se dono) */}
      <div

        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <span>
          Fotos selecionadas: <strong>{selected.length}</strong>
        </span>

        <button
          onClick={downloadSelected}
          disabled={selected.length === 0}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
            background: selected.length === 0 ? "#ccc" : "#111827",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Baixar selecionadas
        </button>

        {IS_OWNER && (
          <>
            <button
              onClick={deleteSelected}
              disabled={selected.length === 0}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                cursor: selected.length === 0 ? "not-allowed" : "pointer",
                background: selected.length === 0 ? "#fecaca" : "#dc2626",
                color: "#fff",
                fontWeight: 500,
              }}
            >
              Excluir selecionadas
            </button>

            <div style={{ marginLeft: "auto" }}>
              <label
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: uploading ? "wait" : "pointer",
                  background: "#16a34a",
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                {uploading ? "Enviando..." : "Enviar fotos"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  multiple={true}
                  style={{ display: "none" }}
                />
              </label>
              {uploadMessage && (
                <p style={{ marginTop: 4, fontSize: "0.8rem" }}>
                  {uploadMessage}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {loading && <p>Carregando fotos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {albumCode && !loading && !error && items.length === 0 && (
        <p>Ainda não há fotos neste álbum.</p>
      )}
      {!albumCode && !loading && !error && (
        <p>Selecione um álbum acima para ver as fotos.</p>
      )}

      {/* ✅ Grade de miniaturas vinda do S3 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item, index) => {
          const key = item.key;
          const isSelected = selected.includes(key);

          return (
            <div
              key={key}
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: isSelected
                  ? "0 0 0 3px #38bdf8, 0 8px 24px rgba(0,0,0,0.25)"
                  : "0 4px 12px rgba(0,0,0,0.16)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {/* ✅ Checkbox de seleção */}
              <label
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 2,
                  background: "rgba(0,0,0,0.6)",
                  padding: 6,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(key)}
                />
              </label>

              {/* ✅ Miniatura que abre o lightbox */}
              <button
                onClick={() => openLightbox(index)}
                style={{
                  border: "none",
                  padding: 0,
                  background: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <Image
                  src={item.url}
                  alt={key}
                  width={800}
                  height={600}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ Lightbox para visualizar foto grande */}
      {isOpen && items.length > 0 && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <button
            onClick={showPrev}
            style={{
              position: "fixed",
              left: 20,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 32,
              cursor: "pointer",
            }}
          >
            ‹
          </button>

          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
          >
            <Image
              src={items[currentIndex].url}
              alt={items[currentIndex].key}
              width={1600}
              height={1200}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: 12,
              }}
            />
          </div>

          <button
            onClick={showNext}
            style={{
              position: "fixed",
              right: 20,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 32,
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
