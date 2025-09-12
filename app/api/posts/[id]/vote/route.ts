import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { VoteSchema } from "@/lib/schemas";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authInstance = await auth;
    const session = await authInstance.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const validatedData = VoteSchema.parse({ 
      postId: resolvedParams.id
    });

    const db = await getDatabase();
    const postsCollection = db.collection("posts");

    const post = await postsCollection.findOne({ 
      _id: new ObjectId(validatedData.postId) 
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const votes = post.votes || [];
    const hasVoted = votes.includes(userId);

    let newPoints = post.points || 0;
    let newVotes;

    if (hasVoted) {
      // Remove vote
      newVotes = votes.filter((id: string) => id !== userId);
      newPoints = Math.max(0, newPoints - 1);
    } else {
      // Add vote
      newVotes = [...votes, userId];
      newPoints = newPoints + 1;
    }

    await postsCollection.updateOne(
      { _id: new ObjectId(validatedData.postId) },
      { 
        $set: { 
          points: newPoints,
          votes: newVotes 
        } 
      }
    );

    return NextResponse.json({ 
      points: newPoints,
      hasVoted: !hasVoted
    });

  } catch (error) {
    console.error("Error voting on post:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}