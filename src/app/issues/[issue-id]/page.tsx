'use client'
import { db, storage } from '@/app/firebase'
import AddCommentBox from '@/components/add-comment-box'
import IssueCommentCard from '@/components/issue-comment-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import formatDate from '@/utils/format-date'
import { NotificationType } from '@/utils/notification-types'
import MDEditor from '@uiw/react-md-editor'
import { Timestamp, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
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
}

export default function IssueDetailsPage() {
  const { "issue-id": issueIdParam } = useParams();
  const issueId = Array.isArray(issueIdParam) ? issueIdParam[0] : issueIdParam; // Ensure only string 
  const [ issueDetails, setIssueDetails ] = useState<IssueDetailsType | null>(null);
  const [ isRequesting, setIsRequesting ] = useState<boolean>(false);
  const [ requestMessage, setRequestMessage ] = useState<string>();
  const { uid, username } = useAuthProvider();
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
        issueClaimerUsername: issueClaimerUsername
      })
    } catch (error) {
      console.error(error)
    }
    
  }

  const checkIfHasRequestedToClaim = async() => {
    if (!issueId) return;

    try {
      const q = query(collection(db, "users"), where("requestingToClaimIssues", "array-contains", issueId));
      const querySnapshot = await getDocs(q);

      setIsRequesting(!querySnapshot.empty);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if(!issueId) return;

    getIssueDoc(); 
    checkIfHasRequestedToClaim();
  }, [uid, issueId]);

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

  const toggleClaimIssue = async() => {
    if (!uid) {
      alert('Please sign in to claim an issue');
      router.push('/sign-in');
      return;
    }
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
          dispatch({ type: "SET_REQUESTING_TO_CLAIM_ISSUES", payload: [...requestingToClaimIssues, issueId as string] });

          // Create notification (expire in 1 month)
          const now = new Date();
          const expiryDate = new Date();
          expiryDate.setMonth(now.getMonth() + 1);
          const notifDocRef = await addDoc(collection(db, "notifications"), {
            recipientId: issueDetails?.issueReporterUid,
            senderId: uid,
            senderUsername: username,
            issueId: issueId,
            issueTitle: issueDetails?.title,
            type: NotificationType.REQ_C_I,
            message: requestMessage,
            timestamp: Timestamp.fromDate(now),
            expiry: Timestamp.fromDate(expiryDate),
          });
          
          // Add to issue owner coll unreadNotif
          await updateDoc(doc(db, "users", issueDetails!.issueReporterUid), { unreadNotif: arrayUnion(notifDocRef.id) });
          
          setIsRequesting(true);
        }
      } else { // Disclaim an issue
        if (confirm('Are you sure to disclaim this issue? The amount of disclaimed issues will be displayed on your profile.')) {
          await updateDoc(doc(db, "users", uid), { 
            claimedIssues: arrayRemove(issueId),
            disclaimedIssuesCount: disclaimedIssuesCount + 1,
          });

          // Create notification (expire in 1 month)
          const now = new Date();
          const expiryDate = new Date();
          expiryDate.setMonth(now.getMonth() + 1);
          const notifDocRef = await addDoc(collection(db, "notifications"), {
            recipientId: issueDetails?.issueReporterUid,
            senderId: uid,
            senderUsername: username,
            issueId: issueId,
            issueTitle: issueDetails?.title,
            type: NotificationType.DIS_I,
            message: '',
            timestamp: Timestamp.fromDate(now),
            expiry: Timestamp.fromDate(expiryDate),
          });
          
          // Add to issue owner coll unreadNotif
          await updateDoc(doc(db, "users", issueDetails!.issueReporterUid), { unreadNotif: arrayUnion(notifDocRef.id) });

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

  const handleReportIssue = async() => {

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

              {
                issueId && uid ? 
                  // If user signed in, show real issue claimed status
                  ( uid === issueDetails?.issueReporterUid ? 
                      // If current user is issue owner, show nothing
                      "" : 
                      // If current user is not issue owner,       
                      (issueDetails?.claimedBy === undefined || issueDetails?.claimedBy?.length === 0 ? 
                        // If issue is not claimed, show claim/ waiting btn
                        <button onClick={toggleClaimIssue}> 
                          <img className="size-5" 
                            src={ isRequesting ? "/waiting.png" : "/claim.png" } 
                            alt={ isRequesting ? "waiting to be accepted" : "claim issue" } 
                            title={isRequesting ? "waiting to be accepted" : "claim issue" } 
                          />
                        </button> : 
                        // If issue is claimed
                        (issueDetails?.claimedBy === uid ? 
                          // If issue is claimed by current user, show disclaim btn
                          <button onClick={toggleClaimIssue}> 
                            <img className="size-5" src="/disclaim.png" alt="disclaim issue" title="disclaim issue" />
                          </button> : 
                          // If issue is not claimed by current user, show nothing
                          ""
                        )   
                      )
                  ) :
                  // If user signed out, show claim issue btn
                  <button onClick={toggleClaimIssue}>
                    <img className="size-5" src="/claim.png" alt="claim issue button" title="claim issue" />
                  </button>
              }
              </>
            }
            
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
