export interface UserCardData {
  id: string;                // візьми login.uuid — унікальний
  name: string;
  gender: string;
  image: string;
  location: { city: string; country: string };
  email: string;
}