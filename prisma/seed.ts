import bcrypt from "bcrypt";
import { prisma } from "../src/config/db.js";

async function main() {
  // Create the first Super Admin
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL! },
    update: { name: "Super Admin" },
    create: {
      email: process.env.ADMIN_EMAIL!,
      name: "Super Admin",
      password: await bcrypt.hash(process.env.ADMIN_DEFAULT_PASS!, 12),
      role: "SUPER_ADMIN",
    },
  });
}

main();
