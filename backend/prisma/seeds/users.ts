import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with test users...");

  const hashedPassword = await hash("password123", 10);

  const users = [
    {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      password: hashedPassword,
      role: Role.admin,
    },
    {
      name: "Diana",
      email: "diana@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Eve",
      email: "eve@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Frank",
      email: "frank@example.com",
      password: hashedPassword,
      role: Role.admin,
    },
    {
      name: "Grace",
      email: "grace@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Hank",
      email: "hank@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Ivy",
      email: "ivy@example.com",
      password: hashedPassword,
      role: Role.user,
    },
    {
      name: "Jack",
      email: "jack@example.com",
      password: hashedPassword,
      role: Role.admin,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
  }

  console.log("✅ Successfully seeded 10 test users.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
