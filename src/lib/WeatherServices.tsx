import { UserCardData } from "@/types/user";

interface ApiUser {
  gender: string;
  email: string;
  name: { title: string; first: string; last: string };
  picture: { medium: string };
  location: { city: string; country: string };
  login: { uuid: string };
}

export default function WeatherServices() {
    const url = 'https://randomuser.me/api/';

    const getAllUsers = async (page: number) => {
        const response = await fetch(`${url}?results=6&page=${page}`);
        const data = await response.json();
        return data.results.map(_transformUser);
    }

    const _transformUser = (user: ApiUser): UserCardData => {
        const {name, email, gender, picture, location, login} = user;
        const nameUser = name.title + ' ' + name.first + ' ' + name.last

        return {
            id: login.uuid,
            name: nameUser,
            email,
            gender,
            image: picture.medium,
            location: {
                city: location.city,
                country: location.country
            }
        }
    }


    return{getAllUsers}
}