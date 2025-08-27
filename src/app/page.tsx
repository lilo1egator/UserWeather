'use client';

import UserList from "@/components/UserList/UserList";
import WeatherServices from "@/lib/WeatherServices";

import { UserCardData } from "@/types/user";
import { useState, useEffect } from "react";

export default function Home() {
  const { getAllUsers } = WeatherServices();
  const [users, setUsers] = useState<UserCardData[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const onRequest = () => {
    getAllUsers(offset)
      .then((data) => {
        setUsers((users) => [...users, ...data]);
        setOffset((offset) => offset + 1);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    onRequest()
  }, []);

  if (loading) {
    return <div className="p-8">Loading…</div>;
  }

  return (
    <div className="font-sans w-full h-full grid place-items-center">
      <UserList users={users} onRequest={onRequest}/>
    </div>
  );
}
