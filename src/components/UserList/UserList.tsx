'use client';

import { UserCardData } from "@/types/user";    
import User from "@/components/User/User";

type Props = {
  users: UserCardData[];
  onRequest: () => void;
};

export default function UserList({users, onRequest}: Props) {
    

    return (
        <div className="w-full">
        <h1 className="mb-6 text-2xl font-bold">Users</h1>

        {/* Grid карток */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map(user => <User values={user}
                                     key={user.id}/>)}
        </div>

        

        {/* Кнопка Load more */}
        <div className="mt-8 flex justify-center">
            <button 
                    className="rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                    onClick={onRequest}>
            Load more
            </button>
        </div>
        </div>
    );
}