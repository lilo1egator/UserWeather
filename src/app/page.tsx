'use client';

import UserList from "@/components/UserList/UserList";
import WeatherServices from "@/lib/WeatherServices";
import { useUsersContext } from "@/providers/UsersProvider";

import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const {users, setUsers, addToSaveUsers} = useUsersContext(); 
  const {loading, error, clearError, getAllUsersWithWeather} = WeatherServices();
  
  const [newLoadingUser, setNewLoadingUser] = useState(false);
  const [offset, setOffset] = useState<number>(1);

  const onRequest = useCallback(async (initial: boolean = false) => {
    clearError();
    setNewLoadingUser(!initial);

    await getAllUsersWithWeather(offset)
      .then((data) => {
        setUsers(prev => (prev.length === 0 ? data : [...prev, ...data]));
        setOffset(prev => prev + 1);
      })
      .catch(console.error)
      .finally(() => setNewLoadingUser(false));
  }, [getAllUsersWithWeather, offset, clearError, newLoadingUser]);

  useEffect(() => {
    if (users.length === 0) onRequest(true)
  }, []);

        
  return (
    <div className="font-sans w-full h-full grid place-items-center">
      <UserList
        users={users}
        newLoadingUser={newLoadingUser}
        onRequest={() => onRequest(false)}
        loading={loading}
        error={error}
        addToSaveUsers={addToSaveUsers}
      />
    </div>
  );
}