// pages/api/whitelist/check.js

// Comando de leitura simples (GetItem) do DynamoDB
import { GetCommand } from "@aws-sdk/lib-dynamodb";
// Client Document já configurado no seu projeto
import { ddb } from "../../../lib/dynamo";
// Autenticação NextAuth (para garantir que há um usuário logado)
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Nome da tabela de whitelist (defina no .env.local)
const TABLE = process.env.DYNAMO_TABLE_WHITELIST;
// Email do dono, que sempre terá acesso
const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

export default async function handler(req, res) {
  // Aceitamos apenas POST aqui
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Garante que existe uma sessão válida (usuário logado)
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  // Dono sempre tem acesso, sem consultar tabela
  if (email.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
    return res.status(200).json({ allowed: true, owner: true });
  }

  try {
    // Monta comando para buscar o item pelo PK (email)
    const command = new GetCommand({
      TableName: TABLE,
      Key: {
        email: email.toLowerCase(),
      },
    });

    // Executa a leitura
    const data = await ddb.send(command);

    // Se encontrou item -> allowed = true, senão false
    const exists = !!data.Item;

    return res.status(200).json({ allowed: exists, owner: false });
  } catch (err) {
    console.error("Erro ao checar whitelist", err);
    return res.status(500).json({
      error: "Erro ao checar whitelist",
      details: err.message || String(err),
    });
  }
}
