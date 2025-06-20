export type UserDisplay = {
  id: string;
  username: string;
  email: string;
};


export type EventSummary = {
  id: string;
  owner: UserDisplay;
  title: string;
  event_datetime: string; // e.g., "2025-06-05"
};

export type EventDetail = {
  id: string;
  owner: UserDisplay;
  title: string;
  description: string;
  event_datetime: string; // e.g., "2025-06-05"
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null;