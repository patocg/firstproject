// pages/api/whitelist/add.js

// PutItem na tabela whitelist (cria ou atualiza)
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
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

  try {
    const now = new Date().toISOString();

    const command = new PutCommand({
      TableName: TABLE,
      Item: {
        email: email.toLowerCase(),
        name: name || null,
        createdAt: now,
        createdBy: session.user.email.toLowerCase(),
      },
    });

    await ddb.send(command);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao adicionar na whitelist", err);
    return res.status(500).json({
      error: "Erro ao adicionar na whitelist",
      details: err.message || String(err),
    });
  }
}
