/**
 * fix-slug.mjs
 * Corrige el slug roto del artículo EN en la base de datos.
 *
 * Slug antiguo: tema-titulo-sugeridopalabras-clave-keywordspor-que-funciona-seo-2026nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams
 * Slug nuevo  : nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { readFileSync } from 'fs';

// Leer .env
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

const OLD_SLUG =
  'tema-titulo-sugeridopalabras-clave-keywordspor-que-funciona-seo-2026nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams';
const NEW_SLUG = 'nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams';

// Verificar que el artículo existe
const post = await prisma.post.findUnique({ where: { slug: OLD_SLUG } });

if (!post) {
  console.error(`❌ No se encontró artículo con slug: ${OLD_SLUG}`);
  process.exit(1);
}

console.log(`\n📝 Artículo encontrado:`);
console.log(`   Título : ${post.title}`);
console.log(`   Locale : ${post.locale}`);
console.log(`   Slug actual: ${post.slug}`);
console.log(`   Nuevo slug : ${NEW_SLUG}\n`);

// Verificar que el nuevo slug no esté ya tomado
const conflict = await prisma.post.findUnique({ where: { slug: NEW_SLUG } });
if (conflict) {
  console.error(`❌ El nuevo slug ya existe en otro artículo: "${conflict.title}"`);
  process.exit(1);
}

// Actualizar
const updated = await prisma.post.update({
  where: { slug: OLD_SLUG },
  data: { slug: NEW_SLUG },
  select: { slug: true, title: true },
});

console.log(`✅ Slug actualizado correctamente:`);
console.log(`   Nuevo slug: ${updated.slug}`);
console.log(`   URL nueva : https://www.idealy.com.mx/en/blog/${updated.slug}\n`);

await prisma.$disconnect();
await pool.end();
