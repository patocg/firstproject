// pages/api/whitelist/list.js
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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

  if (!TABLE) {
    console.error("[Whitelist:list] DYNAMO_TABLE_WHITELIST não configurada.");
    return res.status(500).json({
      error: "Configuração de tabela da whitelist ausente",
    });
  }

  try {
    console.info("[Whitelist:list] Fazendo Scan na tabela:", TABLE);

    const command = new ScanCommand({
      TableName: TABLE,
    });

    const data = await ddb.send(command);

    console.info(
      "[Whitelist:list] Itens encontrados:",
      data.Items ? data.Items.length : 0
    );

    return res.status(200).json({
      items: data.Items || [],
    });
  } catch (err) {
    console.error("[Whitelist:list] Erro ao listar whitelist", err);
    return res.status(500).json({
      error: "Erro ao listar whitelist",
      details: err.message || String(err),
    });
  }
}
