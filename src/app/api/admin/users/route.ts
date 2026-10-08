import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

// GET: Fetch list of users
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Ensure default Admin General exists if DB table is currently empty
    if (users.length === 0) {
      const defaultPass = process.env.ADMIN_PASSWORD || 'password';
      const defaultUser = process.env.ADMIN_USERNAME || 'admin';
      
      const admin = await prisma.user.create({
        data: {
          name: 'Administrador General',
          username: defaultUser,
          email: 'admin@idealy.com.mx',
          password: hashPassword(defaultPass),
          role: 'SUPER_ADMIN',
          active: true,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({ users: [admin] });
    }

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new User
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, username, email, password, role, active } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos obligatorios deben completarse' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if username or email already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanEmail },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'El nombre de usuario o el correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'ADMIN',
        active: active !== undefined ? active : true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
