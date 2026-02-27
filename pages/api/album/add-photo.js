// pages/api/album/add-photo.js

import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo"; // ajuste o caminho conforme seu projeto

const TABLE = process.env.DYNAMO_TABLE_PHOTOS;

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Lê os dados enviados pelo front
    const { albumCode, s3Key, takenDate } = req.body || {};

    if (!albumCode || !s3Key) {
      return res
        .status(400)
        .json({ error: "albumCode e s3Key são obrigatórios" });
    }

    // Data de criação (agora)
    const createdAt = new Date().toISOString();

    // photoKey = takenDate + "#" + s3Key (para ordenar por data)
    const photoKey = `${takenDate || createdAt.slice(0, 10)}#${s3Key}`;

    // Monta o comando de inserção no DynamoDB
    const command = new PutCommand({
      TableName: TABLE,
      Item: {
        albumCode,   // PK
        photoKey,    // SK
        s3Key,
        takenDate: takenDate || null,
        createdAt,
      },
    });

    // Executa o PutItem
    await ddb.send(command);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao adicionar foto no DynamoDB:", err);
    return res.status(500).json({
      error: "Erro ao adicionar foto",
      details: err.message || String(err),
    });
  }
}
