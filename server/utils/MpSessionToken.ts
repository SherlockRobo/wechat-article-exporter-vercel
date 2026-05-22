import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { CookieEntity } from '~/server/utils/CookieStore';

interface MpSessionPayload {
  token: string;
  cookies: CookieEntity[];
}

const VERSION = 'v1';

function getEncryptionKey() {
  const secret = process.env.MP_SESSION_SECRET || process.env.NUXT_MP_SESSION_SECRET || 'wechat-article-exporter-local-dev-secret';
  return createHash('sha256').update(secret).digest();
}

export function sealMpSession(payload: MpSessionPayload): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [VERSION, iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join('.');
}

export function openMpSession(sealed: string | undefined | null): MpSessionPayload | null {
  if (!sealed) {
    return null;
  }

  const [version, iv, tag, encrypted] = sealed.split('.');
  if (version !== VERSION || !iv || !tag || !encrypted) {
    return null;
  }

  try {
    const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch {
    return null;
  }
}
