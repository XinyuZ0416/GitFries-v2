export default function formatDate(time?: Date) {
  if(!time) return 'Loading...';

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
  return time.toLocaleDateString('en-US', options);
}

export function formatTimeOrDate(time: Date) {
  const now = new Date();
  const isSameDay = time.toDateString() === now.toDateString();

  if (isSameDay) {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } else {
    return time.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}