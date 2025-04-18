import { NextResponse } from "next/server";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/app/firebase";
import typesense from "../lib/typesenseServer";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

// TODO: upgrade to typesense cloud on deploy 
// (OR use incremental sync instead of deleting all and fetching all upon page refresh)
export async function GET() {
  const issueSchema: CollectionCreateSchema = {
    name: "issues",
    fields: [
      { name: "title", type: "string" },
      { name: "url", type: "string" },
      { name: "difficulty", type: "string" },
      { name: "language", type: "string" },
      { name: "isUrgent", type: "bool" },
      { name: "issueReporterUid", type: "string" },
      { name: "time", type: "int64" },
      { name: "description", type: "string", optional: true },
      { name: "comments", type: "string[]", optional: true },
      { name: "finishedBy", type: "string", optional: true },
      { name: "claimedBy", type: "string", optional: true },
    ],
  };

  try {
    // Create the collection if it doesn't already exist
    await typesense.collections().create(issueSchema);
  } catch (e: any) {
    if (!e.message.includes("already exists")) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Delete all documents from the Typesense collection
  try {
    const deleteResult = await typesense
      .collections("issues")
      .documents()
      .delete({
        filter_by: "id:*",
      });
    console.log("All documents deleted:", deleteResult);
  } catch (e: any) {
    console.error("Error deleting documents:", e.message);
    return NextResponse.json({ error: `Error deleting documents: ${e.message}` }, { status: 500 });
  }

  // Fetch documents from Firebase Firestore
  const snapshot = await getDocs(collection(db, "issues"));
  const docs: any[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    docs.push({
      id: doc.id,
      ...data,
      time: data.time?.toMillis?.() ?? Date.now(),
    });
  });

  // Import all documents into Typesense
  try {
    const result = await typesense
      .collections("issues")
      .documents()
      .import(docs, { action: "upsert" });
    console.log("Documents imported:", result);
    return NextResponse.json({ message: "Synced!", result });
  } catch (e: any) {
    console.error("Error importing documents:", e.message);
    return NextResponse.json({ error: `Error importing documents: ${e.message}` }, { status: 500 });
  }
}
