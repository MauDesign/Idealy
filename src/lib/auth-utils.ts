import crypto from 'crypto';

/**
 * Securely hashes a plain text password using PBKDF2 with SHA-512 and salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain text password against a stored hashed password.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  
  // If stored password is plain text (legacy / env sync)
  if (!storedHash.includes(':')) {
    return password === storedHash;
  }

  const [salt, originalHash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return originalHash === verifyHash;
}
