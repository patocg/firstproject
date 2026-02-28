// lib/authLogs.js
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "./dynamo";

/**
 * logDeniedAccess
 *
 * Objetivo:
 * - Registrar tentativas de acesso negadas em uma tabela específica do DynamoDB.
 * - Útil para auditoria, métricas e análise de tentativas recorrentes.
 *
 * Estrutura sugerida da tabela (auth_denied_logs):
 * - PK: email (String)
 * - SK opcional: timestamp (String ISO)
 */
export async function logDeniedAccess(email, reason) {
  const tableName = process.env.DYNAMO_TABLE_AUTH_DENIED;

  if (!tableName) {
    console.error(
      "[AuthLogs] DYNAMO_TABLE_AUTH_DENIED não configurada nas envs."
    );
    return;
  }

  const now = new Date().toISOString();

  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        email: email.toLowerCase(),
        timestamp: now,
        reason, // ex.: "NOT_IN_WHITELIST"
      },
    });

    await ddb.send(command);
    console.info("[AuthLogs] Registrado acesso negado para:", email, reason);
  } catch (err) {
    // Não devemos quebrar o fluxo de login por causa de um erro de log.
    console.error("[AuthLogs] Erro ao registrar acesso negado:", err);
  }
}
