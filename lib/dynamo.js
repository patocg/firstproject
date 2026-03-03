// lib/dynamo.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// 🔹 Região e credenciais vêm das envs do ambiente (dev/prod)
// Em produção (Vercel) essas envs precisam estar configuradas
const REGION = process.env.AWS_REGION;

import { logger } from './logger';

if (!REGION) {
  logger.error("AWS_REGION não configurada. Verifique as environment variables.");
  throw new Error("AWS_REGION is required");
}

const client = new DynamoDBClient({
  region: REGION,
  // Opcional: explicitamente usar credenciais via env (Vercel já expõe)
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
});

export const ddb = DynamoDBDocumentClient.from(client);
