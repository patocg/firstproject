import React, { useState } from 'react';

export default function ProjectsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: 'cdm-vlbrm',
      emoji: '📦',
      description: 'Aplicação web para conferência de mercadorias',
      details: `
        Solução robusta para gestão logística e conferência de mercadorias, integrando importação automatizada de XML (NFe/NFC-e), leitura por código de barras e auditoria de divergências em tempo real.

        **Status:** Em fase Beta (Desenvolvimento Ativo)
        **Roadmap:** Release estável planejado ser lançado em 24 semanas após o início do desenvolvimento, com atualizações quinzenais.

        **Infraestrutura em Produção (AWS):**
        - Servidor: AWS EC2 - Ubuntu 24.04 LTS
        - Processamento: 2 vCPUs, 914MB RAM
        - Web Server: Nginx 1.24.0 (reverse proxy)
        - Backend: Python 3.12 + Flask
        - Banco de Dados: SQLite 3.45.1 / PostgreSQL (planejado para RDS)
        - Deploy: Bash script automatizado
        - Versionamento: Git + GitHub

        **Stack e Serviços:**
        - AWS EC2, Nginx, Python 3.12, Flask, SQLite, AWS RDS (planejado)
        - Bash scripting, Git + GitHub, Python venv, Backup automatizado, systemd

        **Arquitetura de Deploy:**
        - Pull automático do repositório Git
        - Backup de dados antes de migrações
        - Migrations de banco de dados com validação
        - Reinicio automático via systemd
        - Logging centralizado
      `,
      tags: ['Python', 'Flask', 'AWS', 'PostgreSQL', 'Nginx'],
      repo: 'https://github.com/Grupo-Valebrum/cdm-vlbrm'
    },
    // Adicione outros projetos aqui
  ];

  return (
    <>
      {/* Botão para abrir o modal */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '24px 0',
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(78, 205, 196, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.3)';
          }}
        >
          🚀 Projetos em Andamento
        </button>
      </div>

      {/* Modal/Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Conteúdo do Modal */}
          {selectedProject ? (
            // Tela de Detalhes do Projeto
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.4s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{selectedProject.emoji}</span>
                  <h2 style={{ margin: 0, color: '#222', fontSize: '1.8rem' }}>
                    {selectedProject.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    background: '#ff6b6b',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = '#ff5252';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = '#ff6b6b';
                  }}
                  title="Voltar"
                >
                  ←
                </button>
              </div>

              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                borderLeft: '4px solid #4ECDC4',
              }}>
                <p style={{ margin: 0, color: '#555', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedProject.details}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                  🏷️ Tags
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: '#e0f7fa',
                        color: '#00838f',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href={selectedProject.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#111827',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#1f2937';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#111827';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔗 Ver no GitHub
                </a>
              </div>
            </div>
          ) : (
            // Lista de Projetos
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.4s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: '#222', fontSize: '1.6rem' }}>
                  🚀 Projetos em Andamento
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: '#ff6b6b',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = '#ff5252';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = '#ff6b6b';
                  }}
                  title="Fechar"
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#4ECDC4';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.2)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{project.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, color: '#111827', fontSize: '1rem' }}>
                        {project.name}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                        {project.description}
                      </p>
                    </div>
                    <span style={{ color: '#9CA3AF' }}>→</span>
                  </button>
                ))}
              </div>

              <p style={{ marginTop: '20px', color: '#9CA3AF', fontSize: '0.85rem', textAlign: 'center' }}>
                Clique em um projeto para ver mais detalhes
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
