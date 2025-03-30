import { Timestamp, addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { NotificationType } from "./notification-types";
import { db } from "@/app/firebase";

const createNotif = async(
  recipientId: string, 
  senderId: string,
  senderUsername: string,
  issueId: string,
  issueTitle: string,
  type: NotificationType, 
  requestMessage: string
) => {
  // Create notification (expire in 1 month)
  const now = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(now.getMonth() + 1);
  
  const notifDocRef = await addDoc(collection(db, "notifications"), {
    recipientId: recipientId,
    senderId: senderId,
    senderUsername: senderUsername,
    issueId: issueId,
    issueTitle: issueTitle,
    type: type,
    message: requestMessage,
    timestamp: Timestamp.fromDate(now),
    expiry: Timestamp.fromDate(expiryDate),
  });
  
  // Add to recipient unreadNotif
  await updateDoc(doc(db, "users", recipientId), { unreadNotif: arrayUnion(notifDocRef.id) });
}

export default createNotif;