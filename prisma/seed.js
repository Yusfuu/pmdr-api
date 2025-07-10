"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    const counter = 10;
    console.log('🌱 Seeding database...');
    await prisma.user.deleteMany();
    for (let i = 0; i < counter; i++) {
        await prisma.user.create({
            data: {
                email: faker_1.faker.internet.email(),
                name: faker_1.faker.person.fullName(),
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
//# sourceMappingURL=seed.js.map