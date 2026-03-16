export interface EventData {
  title: string;
  type: 'wedding' | 'corporate' | 'party' | 'launch';
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    mapUrl?: string;
  };
  description: string;
  rsvpDeadline: string;
  giftRegistryUrl?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: 'serif' | 'sans';
  };
}
