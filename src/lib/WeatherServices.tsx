import { UserCardData } from "@/types/user";
import { useHttp } from "@/hooks/http.hooks";

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
    const {loading, error, request, clearError} = useHttp();

    const getAllUsers = async (page: number) => {
        const response = await request(`${url}?results=6&page=${page}`);
        return response.results.map(_transformUser);
    }

    const _transformUser = (user: ApiUser): UserCardData => {
        const {name, email, gender, picture, location, login} = user;
        const nameUser = name.title + ' ' + name.first + ' ' + name.last

        return {
            id: login.uuid,
            name: nameUser,
            email,
            gender: gender[0].toUpperCase() + '' + gender.slice(1).toLowerCase(),
            image: picture.medium,
            location: {
                city: location.city,
                country: location.country
            }
        }
    }


    return{
        getAllUsers,
        loading,
        error,
        clearError
    }
}