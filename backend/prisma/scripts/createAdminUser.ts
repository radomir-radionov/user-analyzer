import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: "securepassword",
        role: "admin",
      },
    });

    console.log("Admin user created:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
