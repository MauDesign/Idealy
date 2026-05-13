import { createUploadthing, type FileRouter } from "uploadthing/next";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.url);
      
      try {
        await prisma.media.create({
          data: {
            url: file.url,
            name: file.name,
            size: file.size,
            type: file.type,
          },
        });
      } catch (error) {
        console.error("Error saving media to DB:", error);
      }

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
