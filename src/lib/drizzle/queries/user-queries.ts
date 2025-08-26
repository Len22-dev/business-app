import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { users } from '../schema/users-schema';
import { z } from 'zod';
import { createUserSchema } from '@/lib/zod/userSchema';

// const createUserSchema = z.object({
  // email: z.string().email(),
  // fullName: z.string().min(1),
  // phoneNumber: z.string().optional(),
  // avatar: z.string().optional(),
  // isActive: z.boolean().optional(),
  // emailVerified: z.boolean().optional(),
// });

const updateUserSchema = createUserSchema.partial();

export const userQueries = {
  async createUser(data: z.infer<typeof createUserSchema>) {
    const validated = createUserSchema.parse(data);
    const [user] = await db.insert(users).values({
      ...validated,
      isActive: validated.isActive ?? true,
      emailVerified: validated.emailVerified ?? false,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return user;
  },
  async getUserById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },
  async getUsers() {
    return db.query.users.findMany({
      orderBy: [desc(users.created_at)],
    });
  },
  async updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
    const validated = updateUserSchema.parse(data);
    const [user] = await db.update(users)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },
  async deleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id));
    return true;
  },
};


