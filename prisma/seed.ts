import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const counter = 10;

  console.log('🌱 Seeding database...');

  // Optional: clear existing
  await prisma.user.deleteMany();

  // Seed 10 fake users
  for (let i = 0; i < counter; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    });
  }

  console.log('✅ Seeding complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
