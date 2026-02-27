// pages/api/album/list-albums.js

// Importa o comando de Scan do DynamoDB DocumentClient
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
// Importa o client configurado do Dynamo (lib/dynamo.js)
import { ddb } from "../../../lib/dynamo";

// Nome da tabela de fotos (vem do .env)
const TABLE = process.env.DYNAMO_TABLE_PHOTOS;

export default async function handler(req, res) {
  // Só aceitamos requisições GET nessa rota
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Monta o comando para fazer um Scan na tabela inteira,
    // mas projetando apenas os campos necessários:
    // - albumCode: código do álbum (mmaaaa)
    // - deletedAt: data de exclusão (se existir)
    const command = new ScanCommand({
      TableName: TABLE,
      ProjectionExpression: "albumCode, deletedAt",
    });

    // Executa o Scan no DynamoDB
    const data = await ddb.send(command);

    // Usamos um Set para armazenar apenas códigos de álbuns únicos
    // que ainda tenham pelo menos UMA foto "viva" (sem deletedAt)
    const aliveAlbums = new Set();

    for (const item of data.Items || []) {
      // Se o item tem albumCode e NÃO tem deletedAt,
      // significa que pertence a um álbum com fotos ativas
      if (item.albumCode && !item.deletedAt) {
        aliveAlbums.add(item.albumCode);
      }
    }

    // Convertemos o Set em array e ordenamos (ex.: ["012015", "022026", ...])
    const albums = Array.from(aliveAlbums).sort();

    // Retornamos no formato esperado pelo front: { albums: [...] }
    return res.status(200).json({ albums });
  } catch (err) {
    // Em caso de erro na consulta, logamos no servidor
    console.error("Erro ao listar álbuns", err);

    // E retornamos 500 com detalhes básicos do erro
    return res.status(500).json({
      error: "Erro ao listar álbuns",
      details: err.message || String(err),
    });
  }
}
