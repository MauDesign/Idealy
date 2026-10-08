import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth-utils';

async function main() {
  const username = 'Admin.Idealy';
  const rawPassword = 'D3s@rr0ll02o26';
  const email = 'admin@idealy.com.mx';
  const name = 'Administrador General Idealy';
  const role = 'SUPER_ADMIN';

  const hashedPassword = hashPassword(rawPassword);

  console.log(`⏳ Insertando / Actualizando usuario super admin: ${username}...`);

  // Try to find existing user by username or email
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { username: username.toLowerCase() },
        { email },
      ],
    },
  });

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        active: true,
      },
    });
    console.log(`✅ Usuario actualizado exitosamente en PostgreSQL (ID: ${updated.id})`);
  } else {
    const created = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        active: true,
      },
    });
    console.log(`✅ Usuario creado e insertado exitosamente en PostgreSQL (ID: ${created.id})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error insertando usuario:', err);
    process.exit(1);
  });
