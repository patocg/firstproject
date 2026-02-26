import { NextResponse } from 'next/server';

const loginAttempts = new Map();

export function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  
  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, []);
  }
  
  const attempts = loginAttempts.get(key);
  
  // Remover tentativas antigas (mais de 15 minutos)
  const recentAttempts = attempts.filter(
    time => now - time < 15 * 60 * 1000
  );
  
  // Máximo 5 tentativas de login em 15 minutos
  if (recentAttempts.length >= 5) {
    return false;
  }
  
  recentAttempts.push(now);
  loginAttempts.set(key, recentAttempts);
  
  return true;
}
