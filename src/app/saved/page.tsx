'use client';

import UserList from "@/components/UserList/UserList";
import { useUsersContext } from "@/providers/UsersProvider";
import { UserWithWeather } from "@/types/user";

import { useCallback, useEffect, useState } from "react";

const OFFSET = 6;

export default function Saved() {
  const { saveUsers } = useUsersContext();

  const [visible, setVisible] = useState<UserWithWeather[]>(saveUsers);
  const [newLoadingUser, setNewLoadingUser] = useState(false);

  useEffect(() => {
    setVisible(saveUsers.slice(0, OFFSET));
  }, [saveUsers]);

  const onRequestSaved = useCallback(() => {
    setNewLoadingUser(true);
    setVisible(prev => saveUsers.slice(0, prev.length + OFFSET));
    setNewLoadingUser(false);
  }, [saveUsers]);
        
  return (
    <div className="font-sans w-full h-full grid place-items-center">
      <UserList 
          users={visible}
          newLoadingUser={newLoadingUser}
          onRequest={onRequestSaved}
          loading={false}
          error={null}
          />
    </div>
  );
}