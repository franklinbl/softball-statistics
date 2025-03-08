import { Timestamp } from 'firebase/firestore';
export const formatDate = (date: Timestamp | null): string => {
  if (!date) return '-';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };

  return date.toDate().toLocaleDateString('es-ES', options);
};