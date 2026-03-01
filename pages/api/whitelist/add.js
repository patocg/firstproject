// pages/api/whitelist/add.js
//
// Responsabilidade: criar ou atualizar um registro na tabela de whitelist.
// Agora, além de email/name/createdAt/createdBy, gravamos campos de permissão:
// - isActive (bool)
// - lastLoginAt (string, opcional)
// - canViewAlbums / canDeletePhotos / canUploadPhotos / canEditProfile (bool)

import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Nome da tabela de whitelist (vem das envs, dev/prod)
const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
// Sempre ler do .env (server-side)
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

export default async function handler(req, res) {
  // Aceita apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Garante que quem está chamando é o dono
  const session = await getServerSession(req, res, authOptions);
  if (
    !session ||
    !session.user ||
    session.user.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()
  ) {
    return res.status(403).json({ error: "Not allowed" });
  }

  // Dados enviados pelo front
  const { email, name } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  // Garante que a env da tabela está configurada
  if (!TABLE) {
    console.error("[Whitelist:add] DYNAMO_TABLE_WHITELIST não configurada.");
    return res.status(500).json({
      error: "Configuração de tabela da whitelist ausente",
    });
  }

  try {
    const now = new Date().toISOString();
    const normalizedEmail = email.toLowerCase();
    const createdBy = session.user.email.toLowerCase();

    console.info(
      "[Whitelist:add] Adicionando/atualizando email na whitelist:",
      normalizedEmail,
      "tabela:",
      TABLE,
      "por:",
      createdBy
    );

    // Defaults de permissão ao criar um novo usuário na whitelist:
    // - Ativo
    // - Pode ver álbuns
    // - Não pode excluir/mandar upload/alterar cadastro
    const command = new PutCommand({
      TableName: TABLE,
      Item: {
        // PK da tabela (case-insensitive, sempre lower)
        email: normalizedEmail,
        // Nome opcional
        name: name || null,
        // Metadados de auditoria
        createdAt: now,
        createdBy,
        // Campos de permissão / status
        isActive: true,
        lastLoginAt: null,
        canViewAlbums: true,
        canDeletePhotos: false,
        canUploadPhotos: false,
        canEditProfile: false,
      },
    });

    await ddb.send(command);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[Whitelist:add] Erro ao adicionar na whitelist", err);
    return res.status(500).json({
      error: "Erro ao adicionar na whitelist",
      details: err.message || String(err),
    });
  }
}
