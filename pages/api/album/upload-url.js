// pages/api/album/upload-url.js

import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authOptions } from "../auth/[...nextauth]";

// Região e bucket do S3 vindos das variáveis de ambiente
const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
// Prefixo padrão caso o front não envie um s3Key explícito
const prefix = process.env.AWS_S3_ALBUM_PREFIX || "album/";

// Email autorizado a gerar URLs de upload (controle simples de acesso)
const ALLOWED_EMAIL = "jonathas.lima.cunha@gmail.com";

// Cliente S3 usado apenas no backend para gerar a URL assinada
const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Mantemos configuração simples; não adicionamos nada relacionado a checksum aqui
  forcePathStyle: false,
});

// Handler da rota /api/album/upload-url
export default async function handler(req, res) {
  // Só aceitamos POST para gerar URL de upload
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1) Garante que o usuário está logado e é o email autorizado
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || session.user.email !== ALLOWED_EMAIL) {
    return res.status(403).json({ error: "Not allowed" });
  }

  // 2) Dados enviados pelo front: nome, tipo do arquivo e (opcionalmente) a key desejada
  const { fileName, fileType, s3Key } = req.body || {};

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing fileName or fileType" });
  }

  try {
    // 3) Se o front mandar s3Key (ex.: "albuns/022014/08-02-2014_14.jpg"), usamos ela.
    //    Caso contrário, caímos no comportamento antigo usando prefix + timestamp.
    const objectKey = s3Key || `${prefix}${Date.now()}-${fileName}`;

    // 4) Monta o comando PutObject que será usado apenas para assinar a URL.
    //    IMPORTANTE: não defini ContentType para evitar mismatch com o PUT do browser.
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    });


    // 5) Gera a URL assinada (presigned URL) válida por 5 minutos (300 segundos)
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // 6) Devolvemos para o front a URL de upload e a key que deve ser usada depois
    return res.status(200).json({
      uploadUrl,
      key: objectKey,
    });
  } catch (error) {
    // 7) Qualquer erro ao gerar a URL é logado no servidor e retornamos 500
    console.error("Error generating upload URL:", error);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
}
