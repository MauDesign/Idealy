import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });
import { prisma } from './src/lib/prisma';

async function main() {
  const posts = await prisma.post.findMany();
  console.log("Total posts:", posts.length);
  for (const p of posts) {
    console.log(`- Slug: ${p.slug} | Locale: ${p.locale} | Published: ${p.published} | Title: ${p.title}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
