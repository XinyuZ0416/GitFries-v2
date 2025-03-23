'use client'
import { db, storage } from '@/app/firebase'
import AddCommentBox from '@/components/add-comment-box'
import IssueCommentCard from '@/components/issue-comment-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import formatDate from '@/utils/format-date'
import { NotificationType } from '@/utils/notification-types'
import MDEditor from '@uiw/react-md-editor'
import { Timestamp, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
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
}

export default function IssueDetailsPage() {
  const { "issue-id": issueIdParam } = useParams();
  const issueId = Array.isArray(issueIdParam) ? issueIdParam[0] : issueIdParam; // Ensure only string 
  const [ issueDetails, setIssueDetails ] = useState<IssueDetailsType | null>(null);
  const [ isRequesting, setIsRequesting ] = useState<boolean>(false);
  const [ requestMessage, setRequestMessage ] = useState<string>();
  const { uid } = useAuthProvider();
  const { 
    favedIssues, setFavedIssues, 
    claimedIssues, setClaimedIssues, 
    disclaimedIssuesCount, setDisclaimedIssuesCount, 
    requestingToClaimIssues, setRequestingToClaimIssues,
  } = useCurrentUserDocProvider();
  const router = useRouter();

  useEffect(() => {
    if(!issueId) return;

    const getIssueDoc = async() => {
      try {
        const issueDocRef = doc(db, "issues", issueId);
        const issueDocSnap = await getDoc(issueDocRef);

        if(!issueDocSnap.data()) return;

        // get issue reporter info
        const userDocRef = doc(db, "users", issueDocSnap.data()!.issueReporterUid);
        const userDocSnap = await getDoc(userDocRef);

        let picUrl = '/potato.png';
        try {
          picUrl = await getDownloadURL(ref(storage, `user-img/${issueDocSnap.data()!.issueReporterUid}`));
          console.log(picUrl)
        } catch(error: any) {
          if(error.code === "storage/object-not-found") {
            picUrl = '/potato.png';
          } else {
            console.error("Error fetching image:", error.code);
          }
        }

        setIssueDetails({
          issueId: issueId,
          url: issueDocSnap.data()!.url,
          title: issueDocSnap.data()!.title,
          description: issueDocSnap.data()!.description,
          time: issueDocSnap.data()!.time,
          language: issueDocSnap.data()!.language,
          difficulty: issueDocSnap.data()!.difficulty,
          isUrgent: issueDocSnap.data()!.isUrgent,
          issueReporterUid: issueDocSnap.data()!.issueReporterUid,
          issueReporterUsername: userDocSnap.exists() ? userDocSnap.data()!.username : "Unknown",
          issueReporterPicUrl: picUrl,
        })
      } catch (error) {
        console.error(error)
      }
      
    }

    const checkIfHasRequestedToClaim = async() => {
      try {
        const q = query(collection(db, "users"), where("requestingToClaimIssues", "array-contains", issueId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsRequesting(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getIssueDoc();
    checkIfHasRequestedToClaim();
  }, [uid, issueId]);

  const handleDeleteIssue = async() => {
    // TODO: double check with user
    await deleteDoc(doc(db, "issues", issueId as string));
    router.push('/issues');
  }

  const toggleFavIssue = async() => {
    // TODO: redirect logged out users to sign in
    try {
      if (!favedIssues.includes(issueId as string)) {
        await updateDoc(doc(db, "users", uid), { favedIssues: arrayUnion(issueId) });
        setFavedIssues(prev => [...prev, issueId as string]);
        alert('Favorited!');
      } else {
        await updateDoc(doc(db, "users", uid), { favedIssues: arrayRemove(issueId) });
        setFavedIssues(prev => prev.filter(id => id !== issueId));
        alert('Removed from favorited issues!');
      }
    } catch (error) {
      console.error("Error favoriting issue:", error);
    }
  };

  const toggleClaimIssue = async() => {
    try {
      if (!claimedIssues.includes(issueId as string)) { // Request to claim an issue if it hasn't be claimed
        if (isRequesting) {
          alert('You have already requested to claim this issue.');
          return;
        }
        
        const requestMessage = prompt('To claim an issue, please leave a request message to the issue owner:');

        // TODO: only show "claimed" logo after issue owner approves
        if (requestMessage !== null && requestMessage !== "") { // Must send a request message
          setRequestMessage(requestMessage);

          // Add to current user coll requestingToClaimIssues
          await updateDoc(doc(db, "users", uid), { requestingToClaimIssues: arrayUnion(issueId) });
          setRequestingToClaimIssues(prev => [...prev, issueId as string]);

          // Create notification
          const notifDocRef = await addDoc(collection(db, "notifications"), {
            recipientId: issueDetails?.issueReporterUid,
            senderId: uid,
            issueId: issueId,
            type: NotificationType.REQ_C_I,
            message: requestMessage,
            timestamp: Timestamp.fromDate(new Date()),
            read: false
          });
          
          // Add to issue owner coll unreadNotif
          await updateDoc(doc(db, "users", issueDetails!.issueReporterUid), { unreadNotif: arrayUnion(notifDocRef.id) });
          
          setIsRequesting(true);
          
          // TODO: if issue owner accepts, then setClaimedIssues, setIsRequesting(false)
          // await updateDoc(doc(db, "users", uid), { claimedIssues: arrayUnion(issueId) });
          // setClaimedIssues(prev => [...prev, issueId as string]);
        }
      } else { // Disclaim an issue
        if (confirm('Are you sure to disclaim this issue? The amount of disclaimed issues will be displayed on your profile.')) {
          await updateDoc(doc(db, "users", uid), { 
            claimedIssues: arrayRemove(issueId),
            disclaimedIssuesCount: disclaimedIssuesCount + 1,
          });
          setClaimedIssues(prev => prev.filter(id => id !== issueId));
          setDisclaimedIssuesCount(prev => prev + 1);
          alert('Abandoned issue!');
        }
      }
    } catch (error) {
      console.error("Error claiming issue:", error);
    }
  }

  const handleReportIssue = async() => {

  }

  return (
    <>
    <div className="flex flex-col p-3 m-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className='flex flex-row'>
        <section id='user-info'>
          <img className="rounded-full size-14" src={issueDetails?.issueReporterPicUrl ? issueDetails.issueReporterPicUrl : '/potato.png'} alt="user profile" />
          <h6 className='text-lg font-bold'>{issueDetails?.issueReporterUsername}</h6>
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
              <>
              <button onClick={toggleFavIssue}>
                <img className="size-5" src={favedIssues.includes(issueId as string) ? "/logo.png" : "/empty-fries.png" } alt="favorite button" title={favedIssues.includes(issueId as string) ? "unfavorite issue" : "favorite issue" } />
              </button>

              <button onClick={toggleClaimIssue}>
                <img className="size-5" src={ isRequesting ? "/waiting.png" : claimedIssues.includes(issueId as string) ? "/claimed.png" : "/claim.png" } alt="claim issue button" title={isRequesting ? "waiting to be accepted" : claimedIssues.includes(issueId as string) ? "disclaim issue" : "claim issue" } />
              </button>
              </>}
            
            {uid === issueDetails?.issueReporterUid && 
              <button onClick={handleDeleteIssue}>
                <img className="size-5" src="/delete.png" alt="delete button" title="delete issue" />
              </button>}       

            {uid !== issueDetails?.issueReporterUid && 
              <button onClick={handleReportIssue}>
                <img className="size-5" src="/report.png" alt="report button" title="report issue" />
              </button>}  
          </div>
        </section>
      </div>

      <section id='issue-description' className='my-3' data-color-mode="light">
        <MDEditor.Markdown source={issueDetails?.description} />
      </section>

      <AddCommentBox />

      <IssueCommentCard />
    </div>
    </>
  )
}
