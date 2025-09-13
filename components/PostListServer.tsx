import { getPosts } from "@/lib/posts";
import { PostItem } from "./PostItem";
import { PostListPagination } from "./PostListPagination";

interface PostListServerProps {
  page?: number;
}

export async function PostListServer({ page = 1 }: PostListServerProps) {
  const { posts, pagination } = await getPosts(page, 10);

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No posts yet. Be the first to submit one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {posts.map((post, index) => {
          const globalIndex = (page - 1) * 10 + index + 1;
          return (
            <div key={post._id} className="flex items-start gap-2">
              <span className="text-gray-400 text-sm font-mono w-6 text-right mt-2">
                {globalIndex}.
              </span>
              <div className="flex-1">
                <PostItem post={post} />
              </div>
            </div>
          );
        })}
      </div>

      {pagination.totalPages > 1 && (
        <PostListPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
        />
      )}
    </div>
  );
}