// pages/api/whitelist/remove.js
//
// Responsabilidade: remover completamente um usuário da whitelist.
// Somente o dono pode chamar.

import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
// Sempre ler do .env (server-side)
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (
    !session ||
    !session.user ||
    session.user.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()
  ) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  if (!TABLE) {
    console.error("[Whitelist:remove] DYNAMO_TABLE_WHITELIST não configurada.");
    return res.status(500).json({
      error: "Configuração de tabela da whitelist ausente",
    });
  }

  try {
    console.info(
      "[Whitelist:remove] Removendo email:",
      email,
      "da tabela:",
      TABLE
    );

    const command = new DeleteCommand({
      TableName: TABLE,
      Key: { email: email.toLowerCase() },
    });

    await ddb.send(command);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[Whitelist:remove] Erro ao remover da whitelist", err);
    return res.status(500).json({
      error: "Erro ao remover da whitelist",
      details: err.message || String(err),
    });
  }
}
