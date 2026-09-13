import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validação básica
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password e name são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verificar se admin já existe
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Usuário com este email já existe' },
        { status: 400 }
      );
    }

    // Criar hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json(
      {
        message: 'Admin criado com sucesso',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Erro ao criar admin' },
      { status: 500 }
    );
  }
}
