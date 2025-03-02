'use client'
import React from "react";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

export default function TestPage() {
  // Reference Firestore collection
  const colRef = collection(db, "issues");

  // Fetch data using useCollection hook
  const [snapshot, loading, error] = useCollection(colRef);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Issues List</h1>
      <ul>
        {snapshot?.docs.map((doc) => (
          <li key={doc.id}>{JSON.stringify(doc.data())}</li>
        ))}
      </ul>
    </div>
  );
}
