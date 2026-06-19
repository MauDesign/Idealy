import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { readFileSync } from 'fs';

// Leer .env manualmente
const envContent = readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const pool = new pg.Pool({ connectionString: envVars.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const posts = await prisma.post.findMany({
  select: { slug: true, title: true, locale: true, published: true, canonicalUrl: true },
  orderBy: { createdAt: 'desc' },
});

console.log('\n📋 ARTÍCULOS EN BASE DE DATOS:\n');
console.log('LOC | ESTADO   | SLUG                                             | TÍTULO');
console.log('─'.repeat(120));

posts.forEach((p) => {
  const estado = p.published ? '✅ PUB' : '⬜ DFT';
  console.log(`  ${p.locale}  | ${estado}   | ${p.slug.padEnd(50)} | ${p.title}`);
  if (p.canonicalUrl) console.log(`         ↳ canonical override: ${p.canonicalUrl}`);
});

console.log(`\nTotal: ${posts.length} artículo(s)\n`);

await prisma.$disconnect();
await pool.end();
