'use client';

import { UserWithWeather } from "@/types/user";  
import ErrorList from "@/components/ErrorList/ErrorList";
import LoaderList from "@/components/LoaderList/LoaderList";
import User from "@/components/User/User";

type Props = {
  users: UserWithWeather[];
  onRequest: () => void;
  loading: boolean;
  error: boolean | null;
  newLoadingUser: boolean;
  addToSaveUsers?: (user: UserWithWeather) => void;
};

export default function UserList({
  users, onRequest, loading, error, newLoadingUser, addToSaveUsers
}: Props) {
  const components = users.map(user =>
    <User values={user} key={user.id} addToSaveUsers={addToSaveUsers}/>
  );

  const showEmpty = !loading && !error && users.length === 0;

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && users.length === 0 ? (
          <LoaderList/>
        ) : error ? (
          <ErrorList/>
        ) : showEmpty ? (
          <div className="col-span-full text-slate-500">No users yet.</div>
        ) : (
          components
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300 disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
          onClick={onRequest}
          disabled={loading || newLoadingUser}
        >
          Load more
        </button>
      </div>
    </div>
  );
}
