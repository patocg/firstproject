// pages/album/[albumCode].js
// Página de "Fotos do Álbum".
// Responsabilidades principais:
// - Validar sessão + whitelist (com exceção para o dono).
// - Carregar fotos de um álbum específico (mmaaaa, SEM-DATA, etc.).
// - Permitir seleção, download (individual e em massa).
// - Permitir exclusão e upload apenas para o dono.
// - Aplicar tema claro/escuro persistente.
// - Aplicar animação suave na entrada das thumbnails.

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function AlbumDetailPage() {
    const router = useRouter();
    const { albumCode } = router.query;

    // Sessão NextAuth (usuário autenticado).
    const { data: session, status } = useSession();

    // Controle de whitelist (allowed = true se pode ver o álbum).
    const [allowed, setAllowed] = useState(null);

    // Flag de dono vinda da API (não comparamos mais e-mail no front)
    const [isOwner, setIsOwner] = useState(false);


    // Permissões finas vindas da whitelist (upload, excluir, etc.)
    const [permissions, setPermissions] = useState({
        isActive: true,
        canViewAlbums: true,
        canUploadPhotos: false,
        canDeletePhotos: false,
        canEditProfile: false,
    });

    // Itens (fotos) e estado de carregamento/erro.
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Seleção de fotos (chaves S3/DB).
    const [selected, setSelected] = useState([]);

    // Lightbox (visualização em tela cheia).
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Upload de fotos.
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    // Tema (claro/escuro), compartilhado com a página de lista de álbuns.
    const [theme, setTheme] = useState("light");

    // Índice de hover para efeito suave na thumbnail.
    const [hoverIndex, setHoverIndex] = useState(null);

    // ------------------------------------------------
    // TEMA: leitura do localStorage na montagem
    // ------------------------------------------------
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

    // Alterna tema e persiste no localStorage.
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

    // Estilo base da página com base no tema.
    const pageStyle = {
        padding: 32,
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f3f4f6" : "#020617",
        color: theme === "light" ? "#111827" : "#e5e7eb",
        transition: "background-color 0.2s ease, color 0.2s ease",
    };

    // Estilos do switch de tema.
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

    // Dono do álbum (admin global do sistema).
    // Determina se o usuário logado é o OWNER_EMAIL.
    const isOwner =
        session?.user?.email &&
        session.user.email.toLowerCase() === OWNER_EMAIL.toLowerCase();

    // Checa whitelist quando autenticado.
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

                // Salva flag de dono vinda do backend
                setIsOwner(!!data.owner);

                // Salva permissões finas se existirem
                if (data.permissions) {
                    setPermissions(data.permissions);
                }

                // Dono sempre pode acessar, mesmo se allowed vier false
                setAllowed(data.allowed === true || data.owner === true);
            } catch (err) {
                console.error("Erro ao checar whitelist", err);
                setAllowed(false);
                setIsOwner(false);
            }
        };

        checkAccess();
    }, [status, session]);

// Busca as fotos do álbum atual via /api/album/[albumCode].
const fetchAlbum = async (code) => {
    if (!code) return;

    // Limpa estado anterior ao trocar de álbum.
    setItems([]);
    setSelected([]);
    setError("");

    try {
        setLoading(true);

        const res = await fetch(`/api/album/${code}`);
        if (!res.ok) {
            throw new Error("Falha ao carregar álbum");
        }

        const data = await res.json();
        const list = data.items || [];

        setItems(list);
    } catch (err) {
        console.error(err);
        setError(err.message || "Erro ao carregar álbum");
    } finally {
        setLoading(false);
    }
};

// Carrega álbum quando temos albumCode + acesso liberado.
useEffect(() => {
    if (!albumCode) return;
    if (status !== "authenticated") return;
    if (allowed !== true) return;

    fetchAlbum(albumCode);
}, [albumCode, status, allowed]);

// ---------- Guardas de UI (sessão/whitelist) ----------

// Sessão ainda carregando (NextAuth).
if (status === "loading") {
    return <p style={{ padding: 32 }}>Carregando...</p>;
}

// Não logado (não deveria acontecer vindo de /album, mas protegemos).
if (!session) {
    if (typeof window !== "undefined") {
        router.replace("/album");
    }
    return null;
}

// Whitelist ainda não checada.
if (allowed === null) {
    return <p style={{ padding: 32 }}>Verificando permissão de acesso...</p>;
}

// Sem permissão (e não é o dono).
if (!allowed) {
    return (
        <div style={{ padding: 32 }}>
            <p>Você não tem permissão para visualizar este álbum.</p>
            <button
                onClick={() => router.push("/album")}
                style={{
                    marginTop: 12,
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: "#111827",
                    color: "#fff",
                    fontWeight: 500,
                }}
            >
                Voltar para lista de álbuns
            </button>
        </div>
    );
}

// ---------- Controles de lightbox ----------

const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
};

const closeLightbox = () => setIsOpen(false);

const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
};

const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
    );
};

// ------------------ Seleção ------------------

// Marca ou desmarca uma foto individual.
const toggleSelect = (key) => {
    setSelected((prev) =>
        prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
};

// Seleciona todas as fotos do álbum.
const selectAll = () => {
    setSelected(items.map((item) => item.key));
};

// Limpa toda seleção.
const clearSelection = () => {
    setSelected([]);
};

// --------- Download único / em massa ---------

// Download de uma única foto (thumb ou lightbox).
const downloadSingle = async (item) => {
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
};

// Download de todas as fotos selecionadas.
const downloadSelected = async () => {
    const selectedItems = items.filter((item) =>
        selected.includes(item.key)
    );

    if (selectedItems.length === 0) return;

    for (const item of selectedItems) {
        await downloadSingle(item);
    }
};

// --------- Exclusão (apenas dono) ---------

const deleteSelected = async () => {
    // Só permite se for dono OU se tiver permissão explícita
    if (!isOwner && !permissions.canDeletePhotos) return;
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
                        key,
                        albumCode,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || `Falha ao excluir a foto: ${key}`);
                }
            })
        );

        // Remove localmente as fotos excluídas.
        setItems((prev) => prev.filter((item) => !selected.includes(item.key)));
        setSelected([]);

        // Recarrega álbum para garantir estado consistente.
        await fetchAlbum(albumCode);
        setUploadMessage("");
    } catch (error) {
        console.error(error);
        alert(error.message || "Erro ao excluir fotos");
    }
};

// --------- Parse de nomes para upload ---------
// Converte o padrão de nome do arquivo em albumCode + takenDate.
function parseFileName(fileName) {
    const base = fileName.split(".")[0];

    if (base.startsWith("_SEM-DATA_")) {
        return {
            albumCode: "SEM-DATA",
            takenDate: null,
        };
    }

    const datePart = base.split("_")[0];
    const parts = datePart.split("-");

    if (parts.length !== 3) {
        return { albumCode: null, takenDate: null };
    }

    const [dd, mm, yyyy] = parts;
    const albumCodeFromName = `${mm}${yyyy}`;
    const takenDate = `${yyyy}-${mm}-${dd}`;

    return { albumCode: albumCodeFromName, takenDate };
}

// Upload de novas fotos para este álbum (somente dono).
const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadMessage("");
    setUploading(true);

    try {
        let successCount = 0;

        for (const file of files) {
            const { albumCode: codeFromName, takenDate } = parseFileName(file.name);

            if (!codeFromName) {
                console.error(
                    `Nome inválido (${file.name}) — esperado dd-mm-aaaa[_x].ext ou _SEM-DATA_*.ext`
                );
                continue;
            }

            // Por consistência, usamos sempre o albumCode vindo do nome.
            const codeToUse = codeFromName;

            const s3Key = `albuns/${codeToUse}/${file.name}`;

            const res = await fetch("/api/album/upload-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    s3Key,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error("Erro ao gerar URL para", file.name, err);
                continue;
            }

            const { uploadUrl } = await res.json();

            const putRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            });

            if (!putRes.ok) {
                console.error("Erro ao enviar para S3:", file.name);
                continue;
            }

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
            await fetchAlbum(albumCode);
        } else {
            setUploadMessage("Nenhum arquivo foi enviado (verifique os nomes).");
        }
    } catch (error) {
        console.error(error);
        setUploadMessage(`Erro: ${error.message}`);
    } finally {
        setUploading(false);
        event.target.value = "";
    }
};

// CSS global para animação das thumbnails (fade-in + subir).
// Aplicado por card com delay baseado no índice.
const globalAnimationStyle = (
    <style jsx global>{`
      @keyframes fadeUpThumb {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
);

return (
    <div style={pageStyle}>
        {/* Keyframes globais da animação das thumbnails */}
        {globalAnimationStyle}

        {/* Link de retorno para lista de álbuns */}
        <button
            onClick={() => router.push("/album")}
            style={{
                marginBottom: 16,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                cursor: "pointer",
                background: "#f9fafb",
            }}
        >
            ← Voltar para lista de álbuns
        </button>

        <h1>📸 Álbum {albumCode}</h1>

        {/* Header com usuário, sair e switch de tema */}
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 16,
            }}
        >
            <p
                style={{
                    color: theme === "light" ? "#6b7280" : "#d1d5db",
                    fontSize: "0.9rem",
                    margin: 0,
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

            {/* Switch de tema dia/noite */}
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
        </div>

        {/* Barra de ações: seleção, download em massa, exclusão, upload */}
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
                onClick={selectAll}
                disabled={items.length === 0}
                style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    cursor: items.length === 0 ? "not-allowed" : "pointer",
                    background: "#f9fafb",
                }}
            >
                Selecionar todas
            </button>

            {/* Botões que só aparecem quando existe pelo menos 1 foto selecionada */}
            {selected.length > 0 && (
                <>
                    <button
                        onClick={clearSelection}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: "1px solid #d1d5db",
                            cursor: "pointer",
                            background: "#f9fafb",
                        }}
                    >
                        Limpar seleção
                    </button>

                    <button
                        onClick={downloadSelected}
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
                        Baixar selecionadas
                    </button>

                    {/* Exclusão em massa: dono ou quem tiver permissão para excluir fotos */}
                    {(isOwner || permissions.canDeletePhotos) && (
                        <button
                            onClick={deleteSelected}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "none",
                                cursor: "pointer",
                                background: "#dc2626",
                                color: "#fff",
                                fontWeight: 500,
                            }}
                        >
                            Excluir selecionadas
                        </button>
                    )}
                </>
            )}

            {/* Upload: dono ou convidados com permissão de upload */}
            {(isOwner || permissions.canUploadPhotos) && (
                <div>
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
                            multiple
                            onChange={handleFileChange}
                            disabled={uploading}
                            style={{ display: "none" }}
                        />
                    </label>
                    {uploadMessage && (
                        <p style={{ marginTop: 4, fontSize: "0.8rem" }}>{uploadMessage}</p>
                    )}
                </div>
            )}

        </div>
        {loading && <p>Carregando fotos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {
            !loading && !error && items.length === 0 && (
                <p>Ainda não há fotos neste álbum.</p>
            )
        }

        {/* Grade de miniaturas */}
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
            }}
        >
            {items.map((item, index) => {
                const key = item.key;
                const isSelected = selected.includes(key);
                const isHovered = hoverIndex === index;

                // atraso em "onda" para a animação de entrada: 0ms, 30ms, 60ms, ... até 300ms
                const appearDelay = `${Math.min(index * 30, 300)}ms`;

                return (
                    <div
                        key={key}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        style={{
                            position: "relative",
                            borderRadius: 8,
                            overflow: "hidden",
                            boxShadow: isSelected
                                ? "0 0 0 2px #38bdf8, 0 10px 25px rgba(0,0,0,0.35)"
                                : isHovered
                                    ? "0 8px 20px rgba(0,0,0,0.25)"
                                    : "0 3px 10px rgba(0,0,0,0.16)",
                            // hover: leve "lift"
                            transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                            transition:
                                "transform 0.25s ease-out, box-shadow 0.18s ease-out",
                            // animação de entrada: fade-in + subir, com delay por índice
                            animation: "fadeUpThumb 0.28s ease-out forwards",
                            animationDelay: appearDelay,
                        }}
                    >
                        {/* Checkbox de seleção no canto superior esquerdo */}
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

                        {/* Botão de download individual na THUMB (canto superior direito) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadSingle(item);
                            }}
                            aria-label="Baixar esta foto"
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 2,
                                width: 28,
                                height: 28,
                                borderRadius: 999,
                                background: "rgba(0,0,0,0.45)",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    width: 12,
                                    height: 12,
                                    borderLeft: "2px solid #f9fafb",
                                    borderBottom: "2px solid #f9fafb",
                                    transform: "rotate(-45deg) translateY(-1px)",
                                    borderRadius: 1,
                                }}
                            />
                        </button>

                        {/* botão da imagem que abre o lightbox */}
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
                                width={300}
                                height={200}
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

        {/* Lightbox */}
        {
            isOpen && items.length > 0 && (
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
                    {/* Botão fechar */}
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

                    {/* Botão de download individual no LIGHTBOX (ao lado do X) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadSingle(items[currentIndex]);
                        }}
                        aria-label="Baixar foto em tela cheia"
                        style={{
                            position: "fixed",
                            top: 22,
                            right: 70,
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            background: "rgba(15, 23, 42, 0.75)",
                            border: "1px solid rgba(148, 163, 184, 0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        <span
                            style={{
                                display: "block",
                                width: 14,
                                height: 14,
                                borderLeft: "2px solid #e5e7eb",
                                borderBottom: "2px solid #e5e7eb",
                                transform: "rotate(-45deg) translateY(-1px)",
                                borderRadius: 1,
                            }}
                        />
                    </button>

                    {/* Botão anterior */}
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

                    {/* Imagem em tela cheia */}
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

                    {/* Botão próximo */}
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
            )
        }
    </div >
);
}
