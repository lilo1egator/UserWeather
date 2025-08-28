'use client';

import UserList from "@/components/UserList/UserList";
import WeatherServices from "@/lib/WeatherServices";
import { useUsersContext } from "@/providers/UsersProvider";

import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const {users, setUsers, addToSaveUsers} = useUsersContext(); 
  const {loading, error, clearError, getAllUsers} = WeatherServices();
  
  const [newLoadingUser, setNewLoadingUser] = useState(false);
  const [offset, setOffset] = useState<number>(1);

  const onRequest = useCallback((off: number, initial: boolean) => {
    clearError();
    setNewLoadingUser(!initial);

    getAllUsers(off)
      .then((data) => {
        setUsers(prev => (prev.length === 0 ? data : [...prev, ...data]));
        setOffset(prev => prev + 1);
      })
      .catch(console.error)
      .finally(() => setNewLoadingUser(false));
  }, [getAllUsers, setUsers, users.length, clearError]);

  useEffect(() => {
    if (users.length === 0) onRequest(offset, true)
  }, []);

        
  return (
    <div className="font-sans w-full h-full grid place-items-center">
      <UserList
        users={users}
        newLoadingUser={newLoadingUser}
        onRequest={() => onRequest(offset, false)}
        loading={loading}
        error={error}
        addToSaveUsers={addToSaveUsers}
      />
    </div>
  );
}