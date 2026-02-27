// pages/api/whitelist/remove.js

// DeleteItem na tabela whitelist (revoga acesso por email)
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
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

  // Só o dono pode remover
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

  try {
    const command = new DeleteCommand({
      TableName: TABLE,
      Key: {
        email: email.toLowerCase(),
      },
    });

    await ddb.send(command);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao remover da whitelist", err);
    return res.status(500).json({
      error: "Erro ao remover da whitelist",
      details: err.message || String(err),
    });
  }
}
