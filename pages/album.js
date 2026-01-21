import { useState } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

const natal2013 = [
  "1499556_636489593076084_1548772496_n.jpg",
  "20131224_230640.jpg",
  "IMG_20131224_231227.jpg",
  "SAM_0578.JPG",
  "SAM_0581.JPG",
  "SAM_0583.JPG",
  "SAM_0584.JPG",
  "SAM_0585.JPG",
  "SAM_0586.JPG",
  "SAM_0588.JPG",
  "SAM_0589.JPG",
  "SAM_0590.JPG",
  "SAM_0591.JPG",
  "SAM_0592.JPG",
  "SAM_0593.JPG",
  "SAM_0594.JPG",
  "SAM_0595.JPG",
  "SAM_0596.JPG",
  "SAM_0597.JPG",
  "SAM_0598.JPG",
  "SAM_0602.JPG",
  "SAM_0603.JPG",
  "SAM_0604.JPG",
  "SAM_0605.JPG",
  "SAM_0606.JPG",
  "SAM_0607.JPG",
  "SAM_0608.JPG",
  "SAM_0609.JPG",
  "SAM_0610.JPG",
  "SAM_0611.JPG",
  "SAM_0612.JPG",
  "SAM_0613.JPG",
  "SAM_0614.JPG",
  "SAM_0615.JPG",
  "SAM_0616.JPG",
  "SAM_0617.JPG",
  "SAM_0618.JPG",
  "SAM_0619.JPG",
];

export default function AlbumPage() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState([]);

  if (status === "loading") {
    return <p style={{ padding: 32 }}>Carregando...</p>;
  }

  if (!session) {
    return (
      <div style={{ padding: 32 }}>
        <h1>Álbum da família</h1>
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
          }}
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? natal2013.length - 1 : prev - 1
    );
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === natal2013.length - 1 ? 0 : prev + 1
    );
  };

  const toggleSelect = (fileName) => {
    setSelected((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  const downloadSelected = () => {
    selected.forEach((fileName) => {
      const link = document.createElement("a");
      link.href = `/fml/2013/natal/${fileName}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1>📸 Álbum da Família – Natal 2013</h1>

      {/* Barra de ações */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
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
      </div>

      {/* Grade de miniaturas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {natal2013.map((fileName, index) => {
          const isSelected = selected.includes(fileName);

          return (
            <div
              key={fileName}
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
              {/* Checkbox */}
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
                  onChange={() => toggleSelect(fileName)}
                />
              </label>

              {/* Miniatura que abre o lightbox */}
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
                  src={`/fml/2013/natal/${fileName}`}
                  alt={fileName}
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

      {/* Lightbox */}
      {isOpen && (
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
              src={`/fml/2013/natal/${natal2013[currentIndex]}`}
              alt={natal2013[currentIndex]}
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
