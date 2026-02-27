// pages/api/album/[albumCode].js

import { listPhotosByAlbum } from "../../../lib/photos"; // sua função que faz Query no Dynamo
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

// Cliente S3 para gerar signed URL de visualização
const s3 = new S3Client({ region });

export default async function handler(req, res) {
  const { albumCode } = req.query;

  // Só aceita GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (typeof albumCode !== "string") {
    return res.status(400).json({ error: "albumCode inválido" });
  }

  try {
    // 1) Busca metadados no DynamoDB para esse albumCode
    const items = await listPhotosByAlbum(albumCode);

    // 2) Para cada item, gera uma signed URL do S3 e devolve no formato { key, url }
    const mapped = await Promise.all(
      (items || []).map(async (item) => {
        const key = item.s3Key; // ex.: "albuns/022015/01-01-2015_1.jpg"

        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: bucket,
            Key: key,
          }),
          { expiresIn: 300 } // 5 minutos
        );

        return {
          key,
          url,
          takenDate: item.takenDate,
          createdAt: item.createdAt,
        };
      })
    );

    return res.status(200).json({ items: mapped });
  } catch (err) {
    console.error("Erro ao listar fotos", err);
    return res.status(500).json({
      error: "Erro ao listar fotos",
      details: err.message || String(err),
    });
  }
}
