import { publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'

export const tagRouter = router({
  tagList: publicProcedure
  .query(async () => {
    try{
      const tag = await prisma.tag.findMany();
      return tag
    } catch (error) {
      console.log(error)
    }
  }),
  createTag: publicProcedure
  .input(z.string()) // Expect a single string input
  .mutation(async ({ input }) => {
    try {
      // Split the input string by commas, trim each word, and filter out empty values
      const tagsArray = input
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      // Use a loop or map to create a tag for each word
      const createdTags = await Promise.all(
        tagsArray.map(async (tag) => {
          return prisma.tag.upsert({
            where: { name: tag }, // Ensure unique tags by using upsert
            update: {},
            create: { name: tag },
          });
        })
      );

      return createdTags; // Return all created tags
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create tags");
    }
  }),
})