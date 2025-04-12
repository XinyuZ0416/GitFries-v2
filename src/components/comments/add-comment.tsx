'use client'

import { db } from '@/app/firebase';
import createNotif from '@/utils/create-notif';
import { NotificationType } from '@/utils/notification-types';
import MDEditor from '@uiw/react-md-editor'
import { Timestamp, addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'

interface AddCommentBoxProps {
  issueId: string,
  issueReporterUid: string,
  issueTitle: string,
  commenterUid: string,
  commenterUsername: string,
  commenterPicUrl: string
}

export default function AddCommentBox({
  issueId,
  issueReporterUid,
  issueTitle,
  commenterUid,
  commenterUsername,
  commenterPicUrl
}: AddCommentBoxProps) {
  const [ comment, setComment ] = useState<string>();

  const handleChange = (e: any) => {
    setComment(e);
  }

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    if (!comment) {
      alert('Please fill in your comment!');
      return;
    }

    try {
      // Create doc in comments coll
      const commentDocRef = await addDoc(collection(db, "comments"), {
        issueId: issueId,
        issueReporterUid: issueReporterUid,
        issueTitle: issueTitle,
        commenterUid: commenterUid,
        commenterUsername: commenterUsername,
        comment: comment,
        time: Timestamp.fromDate(new Date()),
      });
      
      // Add comment to issue comments field
      await updateDoc(doc(db, "issues", issueId), { comments: arrayUnion(commentDocRef.id) });

      // Add comment to user activities & comments field
      await updateDoc(doc(db, "users", commenterUid), { 
        activities: arrayUnion({
          content: commentDocRef.id,
          type: NotificationType.COM,
          timestamp: Timestamp.fromDate(new Date()),
        }),
        comments: arrayUnion(commentDocRef.id),
        }
      );

      // Create notification and add to issue reporter's unreadNotif
      if (issueReporterUid != commenterUid) {
        createNotif(
          issueReporterUid, 
          commenterUid,
          commenterUsername,
          issueId,
          issueTitle,
          NotificationType.COM, 
          comment,
          commentDocRef.id
        );
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <div className='flex flex-col gap-3'>
      <div className='flex flex-row'>
        <img className="rounded-full size-14" src={commenterPicUrl} alt="user profile" />
        <h6 className='text-lg font-bold'>{commenterUsername}</h6>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <fieldset className="mb-5">
              <label htmlFor="comment" className="block mb-2 text-sm font-medium"></label>
              <div className="container" data-color-mode="light">
                <MDEditor
                  id="comment"
                  value={comment}
                  onChange={handleChange}
                  previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                />
              </div>
            </fieldset>
            
          </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200">
              <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                  Post comment
              </button>
            </div>
        </div>
      </form>
    </div>
    </>
  )
}
