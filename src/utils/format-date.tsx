export default function formatDate(time?: Date) {
  if(!time) return 'Loading...';

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
  return time.toLocaleDateString('en-US', options);
}
