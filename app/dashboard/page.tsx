import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "../utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { BlogPostCard } from "@/components/general/BlogPostCard";

async function getData(userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = await prisma.blogPost.findMany({
    where: {
      authorId: userId, // ✅ fixed typo
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          image: true,
        },
      }, // ✅ include author data with image and name
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Type assertion to inform TypeScript that 'author' exists
  return data.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    authoName: (post as typeof post & { author: { email: string } }).author
      .email, // Use author email as name or replace with actual name if available
    authorImage: (post as typeof post & { author: { image: string } }).author
      .image,
    createdAt: post.createdAt,
  }));
}

export default async function DashboardRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg text-red-500">
          User not found. Please login to view your dashboard.
        </p>
      </div>
    );
  }

  const data = await getData(user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Your Blog Articles</h2>
        <Link className={buttonVariants()} href="/dashboard/create">
          Create Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <BlogPostCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
