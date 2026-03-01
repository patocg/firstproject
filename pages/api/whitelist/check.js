// pages/api/whitelist/check.js
// Endpoint que valida se um e-mail pode acessar os álbuns
// e retorna também as permissões finas (upload, exclusão, etc.).

import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
// Sempre ler do .env (server-side)
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

export default async function handler(req, res) {
  // Aceita apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Garante que a chamada veio de um usuário autenticado
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  if (!TABLE) {
    console.error(
      "[Whitelist:check] DYNAMO_TABLE_WHITELIST não configurada."
    );
    return res.status(500).json({
      error: "Configuração de tabela da whitelist ausente",
    });
  }

  // Dono SEMPRE tem acesso total e todas as permissões ligadas.
  if (email.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
    return res.status(200).json({
      allowed: true,
      owner: true,
      permissions: {
        isActive: true,
        canViewAlbums: true,
        canUploadPhotos: true,
        canDeletePhotos: true,
        canEditProfile: true,
      },
    });
  }

  try {
    console.info(
      "[Whitelist:check] Consultando email:",
      email,
      "na tabela:",
      TABLE
    );

    const command = new GetCommand({
      TableName: TABLE,
      Key: { email: email.toLowerCase() },
    });

    const data = await ddb.send(command);
    const item = data.Item || null;
    const exists = !!item;

    console.info("[Whitelist:check] Encontrado:", exists);

    // Se não existe registro, não está autorizado.
    if (!exists) {
      return res.status(200).json({
        allowed: false,
        owner: false,
        permissions: null,
      });
    }

    // Monta objeto de permissões com defaults seguros
    // (caso os campos ainda não existam em registros antigos).
    const permissions = {
      // Usuário só é considerado "allowed" se estiver ativo.
      isActive: item.isActive !== false, // default true
      canViewAlbums: item.canViewAlbums !== false, // default true
      canUploadPhotos: item.canUploadPhotos === true, // default false
      canDeletePhotos: item.canDeletePhotos === true, // default false
      canEditProfile: item.canEditProfile === true, // default false
    };

    // allowed final leva em conta o isActive e o canViewAlbums.
    const allowed = permissions.isActive && permissions.canViewAlbums;

    return res.status(200).json({
      allowed,
      owner: false,
      permissions,
    });
  } catch (err) {
    console.error("[Whitelist:check] Erro ao checar whitelist", err);
    return res.status(500).json({
      error: "Erro ao checar whitelist",
      details: err.message || String(err),
    });
  }
}
