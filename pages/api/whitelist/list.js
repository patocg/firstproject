// pages/api/whitelist/list.js

// Faz Scan na tabela whitelist para listar todos os emails
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
// Client DynamoDB Document configurado no seu projeto
import { ddb } from "../../../lib/dynamo";
// Para garantir que só usuário logado e dono veja essa lista
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Nome da tabela de whitelist (configure no .env.local)
const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
// Email do dono (somente ele gerencia whitelist)
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

export default async function handler(req, res) {
  // Aceita apenas GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Garante sessão válida
  const session = await getServerSession(req, res, authOptions);
  if (
    !session ||
    !session.user ||
    session.user.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()
  ) {
    return res.status(403).json({ error: "Not allowed" });
  }

  try {
    // Scan simples na tabela
    const command = new ScanCommand({
      TableName: TABLE,
    });

    const data = await ddb.send(command);

    // Retorna lista de itens (cada item = { email, name, ... })
    return res.status(200).json({
      items: data.Items || [],
    });
  } catch (err) {
    console.error("Erro ao listar whitelist", err);
    return res.status(500).json({
      error: "Erro ao listar whitelist",
      details: err.message || String(err),
    });
  }
}
