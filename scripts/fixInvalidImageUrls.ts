import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();

  const defaultBlogImage = "https://picsum.photos/seed/default-blog/600/400";
  const defaultAuthorImage = "/images/default-author.jpg"; // Ensure this exists in /public/images/

  for (const post of posts) {
    let updated = false;
    const updates: Partial<typeof post> = {};

    if (!isValidImageUrl(post.imageUrl)) {
      updates.imageUrl = defaultBlogImage;
      updated = true;
    }

    if (!isValidImageUrl(post.authorImage)) {
      updates.authorImage = defaultAuthorImage;
      updated = true;
    }

    if (updated) {
      await prisma.post.update({
        where: { id: post.id },
        data: updates,
      });
      console.log(`✅ Fixed post: ${post.id}`);
    }
  }

  console.log("🎉 All invalid image URLs have been fixed.");
}

function isValidImageUrl(url: string) {
  return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
}

main()
  .catch((e) => {
    console.error("❌ Error during fix:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
