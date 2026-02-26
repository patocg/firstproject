import dynamic from 'next/dynamic';

const ProjectsModal = dynamic(() => import('../ProjectsModal'), {
  ssr: false,
});

export default function ProjectsSection() {
  return (
    <>
      <hr style={{ margin: "32px 0" }} />
      
      <section style={{ maxWidth: 900, margin: "32px auto", background: "#fff", borderRadius: 12, padding: "0 32px 32px", boxShadow: "0 0 12px #eee" }}>
        <h2>⚡ Projetos em Andamento</h2>
        <p style={{ color: "#555", fontSize: "1rem" }}>
          Confira os projetos que estou desenvolvendo atualmente com foco em tecnologia, inovação e impacto real.
        </p>

        <ProjectsModal />
      </section>

      <hr style={{ margin: "32px 0" }} />
    </>
  );
}
