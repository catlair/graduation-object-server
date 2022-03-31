import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.college.deleteMany();

  console.log('Seeding...');

  const colleges = await prisma.college.createMany({
    data: [
      {
        id: 1,
        name: '建筑与土木工程学院',
      },
      {
        id: 2,
        name: '建筑管理学院',
      },
      {
        id: 3,
        name: '电气工程与智能制造学院',
      },
      {
        id: 4,
        name: '人工智能与大数据学院',
      },
      {
        id: 5,
        name: '经济管理学院',
      },
      {
        id: 6,
        name: '艺术与传媒学院',
      },
      {
        id: 7,
        name: '人文学院',
      },
    ],
  });
  console.log(colleges);

  const user1 = await prisma.user.create({
    data: {
      id: 1,
      college: '电气与信息工程学院',
      name: '李华',
      email: 'catlair@qq.com',
      password: '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
      roles: ['ADMIN', 'TEACHER', 'DIRECTOR', 'SECRETARY'],
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: '日本人',
      college: '土木工程学院',
      id: 2,
      email: 'hello@word.com',
      password: '$2b$10$jAk5OZlq6J9WegdA17iiNe26ysOY4jtgnQGNRwasiC.14CgysBMa.', // 123456
      roles: ['TEACHER'],
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
