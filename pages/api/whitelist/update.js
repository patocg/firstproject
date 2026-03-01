// pages/api/whitelist/update.js
//
// Responsabilidade: atualizar campos de status/permissão de um usuário
// da whitelist (isActive, canViewAlbums, canDeletePhotos, etc.).
// Recebe no body:
//   { email: string, patch: { [campo]: valor } }
// Apenas o dono pode chamar.

import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
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

  const { email, patch } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }
  if (!patch || typeof patch !== "object") {
    return res.status(400).json({ error: "Missing patch object" });
  }

  if (!TABLE) {
    console.error("[Whitelist:update] DYNAMO_TABLE_WHITELIST não configurada.");
    return res.status(500).json({
      error: "Configuração de tabela da whitelist ausente",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase();

    // Monta expressão dinâmica de update: SET campo1 = :v1, campo2 = :v2, ...
    const keys = Object.keys(patch);
    if (keys.length === 0) {
      return res.status(400).json({ error: "Empty patch" });
    }

    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    const sets = [];

    keys.forEach((field, index) => {
      const nameKey = `#f${index}`;
      const valueKey = `:v${index}`;
      ExpressionAttributeNames[nameKey] = field;
      ExpressionAttributeValues[valueKey] = patch[field];
      sets.push(`${nameKey} = ${valueKey}`);
    });

    const UpdateExpression = "SET " + sets.join(", ");

    console.info(
      "[Whitelist:update] Atualizando:",
      normalizedEmail,
      "patch:",
      patch
    );

    const command = new UpdateCommand({
      TableName: TABLE,
      Key: { email: normalizedEmail },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await ddb.send(command);

    return res.status(200).json({
      ok: true,
      item: result.Attributes || null,
    });
  } catch (err) {
    console.error("[Whitelist:update] Erro ao atualizar whitelist", err);
    return res.status(500).json({
      error: "Erro ao atualizar whitelist",
      details: err.message || String(err),
    });
  }
}
