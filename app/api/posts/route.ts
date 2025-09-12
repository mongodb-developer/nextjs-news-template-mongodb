import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { PostSubmissionSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const authInstance = await auth;
    const session = await authInstance.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = PostSubmissionSchema.parse(body);

    const db = await getDatabase();
    const postsCollection = db.collection("posts");

    const newPost = {
      title: validatedData.title,
      url: validatedData.url,
      points: 1,
      submittedBy: session.user.name || "Anonymous User",
      submittedAt: new Date(),
      votes: [session.user.id]
    };

    const result = await postsCollection.insertOne(newPost);
    
    return NextResponse.json({ 
      id: result.insertedId,
      ...newPost 
    });

  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection("posts");
    const usersCollection = db.collection("user");

    const posts = await postsCollection
      .find({})
      .sort({ points: -1, submittedAt: -1 })
      .limit(50)
      .toArray();

    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        let displayName = post.submittedBy;
        
        // If submittedBy looks like a user ID (not a readable name), try to look up the user
        if (displayName && displayName.length > 20 && !displayName.includes('@') && !displayName.includes(' ')) {
          const user = await usersCollection.findOne({ id: post.submittedBy });
          displayName = user?.name || "Anonymous User";
        }
        
        return {
          _id: post._id.toString(),
          title: post.title,
          url: post.url,
          points: post.points,
          submittedBy: displayName || "Anonymous User",
          submittedAt: post.submittedAt,
          votes: post.votes || []
        };
      })
    );

    return NextResponse.json(postsWithUsers);

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}