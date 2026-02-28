// pages/api/whitelist/check.js
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  if (!TABLE) {
    console.error("[Whitelist:check] DYNAMO_TABLE_WHITELIST não configurada.");
    return res.status(500).json({
      error: "Configuração de tabela da whitelist ausente",
    });
  }

  if (email.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
    return res.status(200).json({ allowed: true, owner: true });
  }

  try {
    console.info("[Whitelist:check] Consultando email:", email, "na tabela:", TABLE);

    const command = new GetCommand({
      TableName: TABLE,
      Key: { email: email.toLowerCase() },
    });

    const data = await ddb.send(command);

    const exists = !!data.Item;
    console.info("[Whitelist:check] Encontrado:", exists);

    return res.status(200).json({ allowed: exists, owner: false });
  } catch (err) {
    console.error("[Whitelist:check] Erro ao checar whitelist", err);
    return res.status(500).json({
      error: "Erro ao checar whitelist",
      details: err.message || String(err),
    });
  }
}
