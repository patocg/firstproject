// pages/api/album/upload-url.js

// ✅ Importa autenticação do NextAuth (para checar se é o dono)
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// ✅ SDK v3 do S3 para gerar URL pré-assinada
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../../lib/dynamo";

// 🔧 Lê configurações do S3 a partir das variáveis de ambiente
//    IMPORTANTE: essas envs precisam estar definidas tanto em .env.local (dev)
//    quanto nas Environment Variables da Vercel (Production).
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
// Prefixo padrão para chaves no bucket (caso o front não envie s3Key explícito)
const PREFIX = process.env.AWS_S3_ALBUM_PREFIX || "album/";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "";
const WHITELIST_TABLE = process.env.DYNAMO_TABLE_WHITELIST;

// ✅ Cliente S3 usado apenas no backend (API routes)
//    Aqui usamos credenciais via env (IAM user/role com permissão no bucket).
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // forcePathStyle: false mantém o uso de endpoint padrão do S3 (virtual-hosted style)
});

/**
 * Handler da rota /api/album/upload-url
 *
 * Responsabilidade:
 * - Validar sessão e dono
 * - Validar envs essenciais de S3
 * - Receber nome/tipo do arquivo e, opcionalmente, uma s3Key
 * - Gerar URL pré-assinada (presigned URL) para PUT no S3
 * - Devolver para o front a URL de upload e a key que será usada depois no Dynamo
 */
export default async function handler(req, res) {
  // 🚫 Apenas POST é permitido
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Valida se as envs essenciais do S3 estão configuradas
  if (!REGION || !BUCKET) {
    console.error(
      "[UploadURL] AWS_REGION ou AWS_S3_BUCKET não configurados.",
      { REGION, BUCKET }
    );
    return res.status(500).json({ error: "S3 configuration missing" });
  }

  // ✅ Recupera sessão do NextAuth (usuário logado)
  const session = await getServerSession(req, res, authOptions);

  // 🔐 Garante que há sessão válida
  if (!session || !session.user || !session.user.email) {
    console.warn("[UploadURL] Tentativa sem sessão válida.");
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userEmail = session.user.email.toLowerCase();
  const isOwner = OWNER_EMAIL && userEmail === OWNER_EMAIL.toLowerCase();

  if (!isOwner) {
    try {
      const wl = await ddb.send(new GetCommand({
        TableName: WHITELIST_TABLE,
        Key: { email: userEmail },
      }));
      if (!wl?.Item?.canUploadPhotos) {
        console.warn("[UploadURL] Acesso negado para:", userEmail);
        return res.status(403).json({ error: "Not allowed" });
      }
    } catch {
      console.warn("[UploadURL] Erro ao verificar permissão para:", userEmail);
      return res.status(403).json({ error: "Not allowed" });
    }
  }

  // 📦 Lê dados enviados pelo front:
  // - fileName: nome do arquivo (ex.: "27-02-2026_1.jpg")
  // - fileType: MIME type (ex.: "image/jpeg")
  // - s3Key: chave completa desejada no S3 (opcional)
  const { fileName, fileType, s3Key } = req.body || {};

  if (!fileName || !fileType) {
    return res
      .status(400)
      .json({ error: "Missing fileName or fileType" });
  }

  try {
    // ✅ Se o front mandar s3Key (ex.: "albuns/022015/27-02-2015_1.jpg"), usamos ela.
    //    Caso contrário, caímos no comportamento antigo usando PREFIX + timestamp.
    const objectKey = s3Key || `${PREFIX}${Date.now()}-${fileName}`;

    console.info("[UploadURL] Gerando URL de upload para:", {
      objectKey,
      BUCKET,
      userEmail,
    });

    // ✅ Monta o comando PutObject.
    //    IMPORTANTE: não definimos ContentType aqui para evitar mismatch
    //    entre o que o browser envia e o que foi assinado (isso costuma
    //    causar "Failed to fetch" com 403 em produção).
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: objectKey,
      // Se quiser muito forçar ContentType, precisaria garantir que o PUT do browser
      // enviará exatamente o mesmo valor; por enquanto, mantemos sem para evitar erro.
      // ContentType: fileType,
    });

    // 🔑 Gera a URL pré-assinada válida por 5 minutos (300 segundos).
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // 🔁 Devolve para o front a URL de upload + key
    //     - uploadUrl: será usada no fetch PUT direto para o S3
    //     - key: será usada depois em /api/album/add-photo para salvar no Dynamo
    return res.status(200).json({
      uploadUrl,
      key: objectKey,
    });
  } catch (error) {
    // 🧨 Qualquer erro ao gerar a URL é logado no servidor
    console.error("[UploadURL] Error generating upload URL:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate upload URL" });
  }
}
