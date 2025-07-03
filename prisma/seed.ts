// prisma/seed.ts
import { PrismaClient, UserStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const usersToCreate = 50;

  for (let i = 0; i < usersToCreate; i++) {
    const first = faker.person.firstName().toLowerCase();
    const last = faker.person.lastName().toLowerCase();

    await prisma.user.create({
      data: {
        username: `${first}.${last}`,
        avatar: faker.image.personPortrait(),
        password: faker.internet.password(),
        // status: faker.helpers.arrayElement([
        //   UserStatus.ONLINE,
        //   UserStatus.OFFLINE,
        //   UserStatus.AWAY,
        // ]),
      },
    });
  }

  console.log(`🌱 Seeded ${usersToCreate} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
