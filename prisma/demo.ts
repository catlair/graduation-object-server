import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  const users = await prisma.user.createMany({
    data: [
      {
        id: '18100001',
        college: '人工智能与大数据学院',
        name: '李华',
        email: 'kudou.ran@outlook.com',
        password:
          '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
        roles: ['ADMIN'],
      },
      {
        id: '18100002',
        college: '人工智能与大数据学院',
        name: '主任丙',
        email: 'demo@demo.com',
        password:
          '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
        roles: ['DIRECTOR'],
      },
      {
        id: '18100003',
        college: '人工智能与大数据学院',
        name: '副主任丁',
        email: 'demo@demo1.com',
        password:
          '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
        roles: ['VICE_DIRECTOR'],
      },
      {
        id: '18100004',
        college: '人工智能与大数据学院',
        name: '教师甲',
        email: 'hello@word.com',
        password:
          '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
        roles: ['TEACHER'],
      },
      {
        id: '18100005',
        college: '人工智能与大数据学院',
        name: '教秘乙',
        email: 'me@demo.com',
        password:
          '$2a$10$CmqjOLWpKpAC47v.FUgnOOBoi5y.K1KmbEgzaE5j01MM9eVL9sxoW', // 123456
        roles: ['SECRETARY'],
      },
    ],
  });

  console.log({ users });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
