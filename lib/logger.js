/**
 * Sistema de Logging para Produção
 * 
 * Substitui console.log para evitar vazamento de dados sensíveis
 * e permitir controle do que é logado em produção
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isVerbose = process.env.LOG_LEVEL === 'verbose';

// Níveis de log
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Nível atual (produção = INFO, desenvolvimento = DEBUG)
const CURRENT_LEVEL = isDevelopment 
  ? LOG_LEVELS.DEBUG 
  : LOG_LEVELS.INFO;

/**
 * Formata a mensagem de log com timestamp e nível
 */
function formatMessage(level, message, data) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (data !== undefined) {
    return `${prefix} ${message}`;
  }
  
  return `${prefix} ${message}`;
}

/**
 * Logger principal
 */
export const logger = {
  error: (message, data) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message), data || '');
    }
  },
  
  warn: (message, data) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message), data || '');
    }
  },
  
  info: (message, data) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      console.info(formatMessage('INFO', message), data || '');
    }
  },
  
  debug: (message, data) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage('DEBUG', message), data || '');
    }
  },
};

/**
 * Middleware para log de requests (opcional para API routes)
 */
export function logRequest(method, url, status, duration) {
  if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
    logger.info(`${method} ${url} - ${status} (${duration}ms)`);
  }
}

/**
 * Log seguro para emails (mascara a maior parte do email)
 */
export function maskEmail(email) {
  if (!email) return '***';
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  const maskedUser = user.substring(0, 2) + user.substring(2).replace(/./g, '*');
  return `${maskedUser}@${domain}`;
}
