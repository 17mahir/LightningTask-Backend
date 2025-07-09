import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete any existing admin users
  await prisma.user.deleteMany({
    where: { role: 'ADMIN' },
  });

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: 'Mahir',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  console.log('✅ Admin user replaced with new credentials');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });