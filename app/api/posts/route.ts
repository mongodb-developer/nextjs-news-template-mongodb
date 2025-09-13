import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const db = await getDatabase();
    const postsCollection = db.collection("posts");

    // Get total count for pagination
    const totalCount = await postsCollection.countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    const posts = await postsCollection
      .find({})
      .sort({ points: -1, submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const postsForResponse = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      votes: post.votes || []
    }));

    return NextResponse.json({
      posts: postsForResponse,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}