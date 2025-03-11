'use client'
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { db } from '../firebase';

export default function PlayGround() {
  useEffect(() => {
    const createDoc = async() => {
      await addDoc(collection(db, "issues"), {
        issueReporterUid: "Lv16lVciibhqZo4D9GvBvVWYxRS2",
        issueUrl: "https://github.com/spotDL/spotify-downloader/issues/2317",
        issueTitle: "Order of m3u file not always correct when manually matching",
        description: "The order of songs in the m3u file is the same as in the Spotify playlist but manually matched songs are always at the top of the file as well as in the correct position. Also when running the command again to download new songs the m3u file is not correctly updated and random songs seem to be placed on top",
        language: "C",
        difficulty: "headache",
        isUrgent: true,
      });
    }
    createDoc();
  }, []);
  return (
    <div>PlayGround</div>
  )
}
