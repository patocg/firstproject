// pages/api/whitelist/add.js

// PutItem na tabela whitelist (cria ou atualiza um registro)
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Nome da tabela de whitelist (vem das envs, dev/prod)
const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
// Email do dono, único autorizado a gerenciar whitelist
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

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

    const command = new PutCommand({
      TableName: TABLE,
      Item: {
        // PK da tabela (case-insensitive, sempre lower)
        email: normalizedEmail,
        // Nome opcional, se não vier fica null
        name: name || null,
        // Metadados de auditoria
        createdAt: now,
        createdBy,
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
