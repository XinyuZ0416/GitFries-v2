'use client'
import { db, storage } from '@/app/firebase'
import AddCommentBox from '@/components/comments/add-comment'
import IssueCommentCard from '@/components/comments/issue-comment'
import { useAuthProvider } from '@/providers/auth-provider'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import createNotif from '@/utils/create-notif'
import formatDate from '@/utils/format-date'
import { NotificationType } from '@/utils/notification-types'
import MDEditor from '@uiw/react-md-editor'
import { Timestamp, arrayRemove, arrayUnion, deleteDoc, deleteField, doc, getDoc, getDocs, increment, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type IssueDetailsType = {
  issueId: string,
  url: string,
  title: string,
  description: string,
  time: Timestamp,
  language: string,
  difficulty: string,
  isUrgent: boolean,
  issueReporterUid: string,
  issueReporterUsername: string,
  issueReporterPicUrl: string,
  claimedBy?: string,
  issueClaimerUsername: string
  finishedBy?: string,
  issueFinisherUsername: string
}

type CommentType = {
  commentId: string,
  commenterUid: string,
  commenterUsername: string,
  commenterPicUrl: string
  comment: string,
  time: Timestamp
}

export default function IssueDetailsPage() {
  const { "issue-id": issueIdParam } = useParams();
  const issueId = Array.isArray(issueIdParam) ? issueIdParam[0] : issueIdParam; // Ensure only string 
  const [ issueDetails, setIssueDetails ] = useState<IssueDetailsType | null>(null);
  const [ isRequesting, setIsRequesting ] = useState<boolean>(false);
  const [ requestMessage, setRequestMessage ] = useState<string>();
  const [ commentsArr, setCommentsArr ] = useState<CommentType[]>();
  const { uid, username, userPicUrl } = useAuthProvider();
  const { 
    favedIssues, 
    claimedIssues, 
    disclaimedIssuesCount,
    requestingToClaimIssues,
    dispatch
  } = useCurrentUserDocProvider();
  const router = useRouter();

  const getIssueDoc = async() => {
    try {
      if (!issueId) return;
      
      const issueDocRef = doc(db, "issues", issueId);
      const issueDocSnap = await getDoc(issueDocRef);
      const issueData = issueDocSnap.data();

      if(!issueData) return;

      let issueClaimerUsername;
      if(issueData.claimedBy){
        const docSnap = await getDoc(doc(db, "users", issueData.claimedBy))
        issueClaimerUsername = docSnap.data()!.username
      }

      let issueFinisherUsername;
      if(issueData.finishedBy){
        const docSnap = await getDoc(doc(db, "users", issueData.finishedBy))
        issueFinisherUsername = docSnap.data()!.username
      }

      // get issue reporter info
      const userDocRef = doc(db, "users", issueData!.issueReporterUid);
      const userDocSnap = await getDoc(userDocRef);

      const picUrl = await getDownloadURL(ref(storage, `user-img/${issueData.issueReporterUid}`)).catch(() => '/potato.png');

      setIssueDetails({
        issueId: issueId,
        url: issueData!.url,
        title: issueData!.title,
        description: issueData!.description,
        time: issueData!.time,
        language: issueData!.language,
        difficulty: issueData!.difficulty,
        isUrgent: issueData!.isUrgent,
        issueReporterUid: issueData!.issueReporterUid,
        issueReporterUsername: userDocSnap.exists() ? userDocSnap.data()!.username : "Unknown",
        issueReporterPicUrl: picUrl,
        claimedBy: issueData!.claimedBy,
        issueClaimerUsername: issueClaimerUsername,
        finishedBy: issueData!.finishedBy,
        issueFinisherUsername: issueFinisherUsername,
      })
    } catch (error) {
      console.error(error)
    }
    
  }

  const checkIfHasRequestedToClaimOrFinish = async() => {
    if (!issueId || !uid) return;
  
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setIsRequesting(userData.requestingToClaimIssues?.includes(issueId) || userData.requestingToFinishIssues?.includes(issueId) || false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(!issueId) return;

    getIssueDoc(); 
    checkIfHasRequestedToClaimOrFinish();
  }, [uid, issueId]);

  // Listen to real-time comment update
  useEffect(() => {
    if (!issueId) return;
  
    const docRef = doc(db, "issues", issueId);
  
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const commentIdArr = docSnap.data().comments || [];
        const arr: CommentType[] = [];
  
        const commentPromises = commentIdArr.map(async (commentId: string) => {
          const commentSnap = await getDoc(doc(db, "comments", commentId));
          if (commentSnap.exists()) {
            const data = commentSnap.data();
  
            // Fetch user profile picture
            const picUrl = await getDownloadURL(ref(storage, `user-img/${data.commenterUid}`))
              .catch(() => '/potato.png');
  
            return {
              commentId: commentSnap.id,
              commenterUid: data.commenterUid,
              commenterUsername: data.commenterUsername,
              comment: data.comment,
              commenterPicUrl: picUrl,
              time: data.time,
            };
          }
        });

        const comments = await Promise.all(commentPromises);
  
        // Filter out any null values and update the state
        setCommentsArr(comments);
      }
    });
  
    return () => unsubscribe();
  }, [issueId]); 
  

  const handleDeleteIssue = async() => {
    if (issueDetails?.claimedBy) {
      alert('You cannot delete a claimed issue!');
      return;
    }

    if(!confirm("Are you sure you want to delete this issue? This action cannot be undone.")) return;
    
    try{
      await deleteDoc(doc(db, "issues", issueId as string));
      await updateDoc(doc(db, "users", uid), {
        ostedIssues : arrayRemove(issueId),
        requestingToClaimIssues : arrayRemove(issueId)
      });
      router.push('/issues');
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  }

  const toggleFavIssue = async() => {
    if (!uid) {
      alert('Please sign in to favorite an issue');
      router.push('/sign-in');
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid), { 
        favedIssues: favedIssues.includes(issueId as string) ? arrayRemove(issueId) : arrayUnion(issueId) 
      });
      dispatch({ 
        type: "SET_FAVED_ISSUES", 
        payload: favedIssues.includes(issueId as string) ? favedIssues.filter(id => id !== issueId) : [...favedIssues, issueId as string] 
      });
    } catch (error) {
      console.error("Error favoriting issue:", error);
    }
  };

  const toggleClaimIssue = async(issueReporterUid: string) => {
    if (!uid) {
      alert('Please sign in to claim an issue');
      router.push('/sign-in');
      return;
    }
    try {
      if (!claimedIssues.includes(issueId as string)) { // Request to claim an issue if it hasn't be claimed
        if (isRequesting) {
          alert('You have already sent request.');
          return;
        }
        
        const requestMessage = prompt('To claim an issue, please leave a request message to the issue owner:');

        // TODO: only show "claimed" logo after issue owner approves
        if (requestMessage !== null && requestMessage !== "") { // Must send a request message
          setRequestMessage(requestMessage);

          // Add to current user coll requestingToClaimIssues and activities
          await updateDoc(doc(db, "users", uid), { 
            requestingToClaimIssues: arrayUnion(issueId),
            activities: arrayUnion({
              content: issueId,
              type: NotificationType.REQ_C_I,
              timestamp: Timestamp.fromDate(new Date()),
            })
          });
          dispatch({ type: "SET_REQUESTING_TO_CLAIM_ISSUES", payload: [...requestingToClaimIssues, issueId as string] });
          
          // Update issue reporter achievementsHelpers
          await updateDoc(doc(db, "users", issueReporterUid), { 
            "achievementsHelpers.receivedClaimIssueRequestsCounts": increment(1),
          });   

          createNotif(
            issueDetails?.issueReporterUid!, 
            uid, 
            username, 
            issueId!, 
            issueDetails?.title!, 
            NotificationType.REQ_C_I, 
            requestMessage
          );
          
          setIsRequesting(true);
        }
      } else { // Disclaim an issue
        if (confirm('Are you sure to disclaim this issue? The amount of disclaimed issues will be displayed on your profile. This action cannot be undone.')) {
          await updateDoc(doc(db, "users", uid), { 
            claimedIssues: arrayRemove(issueId),
            disclaimedIssuesCount: disclaimedIssuesCount + 1,
            activities: arrayUnion({
              content: issueId,
              type: NotificationType.DIS_I,
              timestamp: Timestamp.fromDate(new Date()),
            })
          });

          createNotif(
            issueDetails?.issueReporterUid!, 
            uid, 
            username, 
            issueId!, 
            issueDetails?.title!, 
            NotificationType.DIS_I, 
            ""
          );
          
          // Remomve issue claimedBy content
          await updateDoc(doc(db, "issues", issueId!), { claimedBy: deleteField() });

          dispatch({ type: "SET_CLAIMED_ISSUES", payload: claimedIssues.filter(id => id !== issueId) });
          dispatch({ type: "SET_DISCLAIMED_ISSUES_COUNT", payload: disclaimedIssuesCount + 1 });
          alert('Disclaimed issue!');
        }
      }
    } catch (error) {
      console.error("Error claiming issue:", error);
    }
  }

  const handleFinishIssue = async(issueReporterUid: string) => {
    if (isRequesting) {
      alert('You have already sent request.');
      return;
    }

    if(!confirm("Are you sure you have finished this issue? This action cannot be undone.")) return;

    // Update issue requester requestingToFinishIssues and activity
    const now = new Date();
    await updateDoc(doc(db, "users", uid), { 
      requestingToFinishIssues: arrayUnion(issueId),
      activities: arrayUnion({
        content: issueId,
        type: NotificationType.REQ_F_I,
        timestamp: Timestamp.fromDate(now),
      })
    });
    const nowMs = Timestamp.fromDate(now).toMillis();
    const issueCreatedTimeMs = issueDetails?.time.toMillis();
    const oneHourMs = 60 * 60 * 1000;
    if (issueCreatedTimeMs) {
      const timeDiff = nowMs - issueCreatedTimeMs;
      if (timeDiff >= 0 && timeDiff <= oneHourMs) {
        // Update issue reporter achievementsHelpers
        await updateDoc(doc(db, "users", uid), { 
          "achievementsHelpers.finishedIssueWithinOneHour": true,
        });    
      }
    }

    // Update issue reporter achievementsHelpers
    await updateDoc(doc(db, "users", issueReporterUid), { 
      "achievementsHelpers.receivedFinishIssueRequestsCounts": increment(1),
    });    
    
    createNotif(
      issueDetails?.issueReporterUid!, 
      uid, 
      username, 
      issueId!, 
      issueDetails?.title!, 
      NotificationType.REQ_F_I, 
      ""
    );
    
    setIsRequesting(true);
    alert("The request to finish this issue has been sent. The issue owner will soon accept/ decline this request.");
  }

  const renderClaimBtns = (issueReporterUid: string) => {
    if(!issueId) return;

    // If user signed out, show claim issue btn
    if (!uid) {
      return(
        <button onClick={() => toggleClaimIssue(issueReporterUid)}>
          <img className="size-5" src="/claim.png" alt="claim issue button" title="claim issue" />
        </button>
      )
    }

    // If current user is issue owner, show nothing
    if (uid === issueDetails?.issueReporterUid) {
      return null;
    }

    // If issue has been finished, show nothing
    if (issueDetails?.finishedBy) {
      return null;
    }

    if (!issueDetails?.claimedBy) {
      // If issue is not claimed, show claim/ waiting btn
      return(
        <button onClick={() => toggleClaimIssue(issueReporterUid)}> 
          <img className="size-5" 
            src={ isRequesting ? "/waiting.png" : "/claim.png" } 
            alt={ isRequesting ? "waiting to be accepted" : "claim issue" } 
            title={ isRequesting ? "waiting to be accepted" : "claim issue" } 
          />
        </button>
      )
    } else {
      if (issueDetails?.claimedBy === uid) {
        // If issue is claimed by current user, show disclaim btn and finish btn
        return(
          <>
          <button onClick={() => toggleClaimIssue(issueReporterUid)}> 
            <img className="size-5" src="/disclaim.png" alt="disclaim issue" title="disclaim issue" />
          </button>
          <button onClick={() => handleFinishIssue(issueDetails?.issueReporterUid)}> 
            <img className="size-5" 
              src={ isRequesting ? "/waiting.png" : "/finish.png" } 
              alt={ isRequesting ? "waiting to be accepted" : "finish issue" } 
              title={ isRequesting ? "waiting to be accepted" : "finish issue" } 
            />
          </button>
          </>
        )
      } else {
        // If issue is claimed by another user, show nothing
        return null;
      }
    }
  }

  return (
    <>
    <div className="flex flex-col p-3 m-3 bg-white border border-gray-200 rounded-lg shadow-sm">
    { issueId && uid && issueDetails?.claimedBy&& 
      <h2 className="text-2xl font-bold text-red-600">CLAIMED BY 
        <Link href={`/profile/${issueDetails?.claimedBy}`}>
        {issueDetails.issueClaimerUsername}
        </Link>
      </h2>
    }
    { issueId && uid && issueDetails?.finishedBy&& 
      <h2 className="text-2xl font-bold text-green-500">Finished BY 
        <Link href={`/profile/${issueDetails?.finishedBy}`}>
        {issueDetails.issueFinisherUsername}
        </Link>
      </h2>
    }
      <div className='flex flex-row'>
        <section id='user-info'>
          <Link href={`/profile/${issueDetails?.issueReporterUid}`}>
          <img className="rounded-full size-14" src={issueDetails?.issueReporterPicUrl ? issueDetails.issueReporterPicUrl : '/potato.png'} alt="user profile" />
          <h6 className='text-lg font-bold'>{issueDetails?.issueReporterUsername}</h6>
          </Link>
        </section>

        <section id='issue-basic-info' className="flex flex-col justify-between px-4 py-2">
          <h5 className="text-xl font-bold">{issueDetails?.title}</h5>
          
          <div className='flex flex-row gap-2'>
            <p className="font-normal text-gray-700">{formatDate(issueDetails?.time.toDate() as Date)}</p>
            <p className="font-normal text-gray-700">{issueDetails?.language}</p>
            <p className="font-normal text-gray-700">{issueDetails?.difficulty}</p>
            <a href={issueDetails?.url} target='_blank'>
              <img className="size-5" src="/link.png" alt="link" title="link to original issue" />
            </a> 
            {uid !== issueDetails?.issueReporterUid && 
              <button onClick={toggleFavIssue}>
                <img className="size-5" src={favedIssues.includes(issueId as string) ? "/logo.png" : "/empty-fries.png" } alt="favorite button" title={favedIssues.includes(issueId as string) ? "unfavorite issue" : "favorite issue" } />
              </button>
            }
            {issueDetails?.issueReporterUid && renderClaimBtns(issueDetails?.issueReporterUid)}
            {uid === issueDetails?.issueReporterUid && 
              <button onClick={handleDeleteIssue}>
                <img className="size-5" src="/delete.png" alt="delete button" title="delete issue" />
              </button>}
          </div>
        </section>
      </div>

      <section id='issue-description' className='my-3' data-color-mode="light">
        <MDEditor.Markdown source={issueDetails?.description} />
      </section>

      {issueDetails && issueId && issueDetails.issueReporterUid && <AddCommentBox 
        issueId={issueId}
        issueReporterUid={issueDetails!.issueReporterUid}
        issueTitle={issueDetails!.title}
        commenterUid={uid}
        commenterUsername={username}
        commenterPicUrl={userPicUrl}
      />}
      
      { commentsArr && commentsArr.length > 0 ? 
          commentsArr?.map((comment) => (
            <IssueCommentCard
              key={comment.commentId}
              commenterUid={comment.commenterUid}
              commenterUsername={comment.commenterUsername}
              commenterPicUrl={comment.commenterPicUrl}
              comment={comment.comment}
              time={comment.time}
            />
          )) :
          ""
      }
      
    </div>
    </>
  )
}
