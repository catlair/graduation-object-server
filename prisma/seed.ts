import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      id: 22000001,
      college: '电气与信息工程学院',
      name: '李华',
      email: 'lisa@simpson.com',
      password: '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
      roles: ['ADMIN', 'TEACHER'],
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: '日本人',
      college: '土木工程学院',
      id: 22000002,
      email: 'bart@simpson.com',
      password: '$2b$10$jAk5OZlq6J9WegdA17iiNe26ysOY4jtgnQGNRwasiC.14CgysBMa.', // 123456
      roles: ['SECRETARY'],
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
