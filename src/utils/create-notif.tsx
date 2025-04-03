import { Timestamp, addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { NotificationType } from "./notification-types";
import { db } from "@/app/firebase";

type NotificationDataType = {
  recipientId: string;
  senderId: string;
  senderUsername: string;
  issueId: string;
  issueTitle: string;
  type: NotificationType;
  message: string;
  timestamp: Timestamp;
  expiry: Timestamp;
  commentId?: string;
};

const createNotif = async(
  recipientId: string, 
  senderId: string,
  senderUsername: string,
  issueId: string,
  issueTitle: string,
  type: NotificationType, 
  requestMessage: string,
  commentId?: string // Optional parameter for comment notifications
) => {
  // Create notification (expire in 1 month)
  const now = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(now.getMonth() + 1);

  // Base notification object
  const notificationData: NotificationDataType = {
    recipientId: recipientId,
    senderId: senderId,
    senderUsername: senderUsername,
    issueId: issueId,
    issueTitle: issueTitle,
    type: type,
    message: requestMessage,
    timestamp: Timestamp.fromDate(now),
    expiry: Timestamp.fromDate(expiryDate),
  };

  // Add commentId field if the notification is from a comment
  if (type === NotificationType.COM && commentId) {
    notificationData.commentId = commentId;
  }
  
  const notifDocRef = await addDoc(collection(db, "notifications"), notificationData);
  
  // Add to recipient unreadNotif
  await updateDoc(doc(db, "users", recipientId), { unreadNotif: arrayUnion(notifDocRef.id) });
}

export default createNotif;