'use client';

import { UserCardData } from "@/types/user";
import { useState, useEffect, createContext, useContext, useMemo} from "react";

interface ProvidersProps {
    users: UserCardData[];
    saveUsers: UserCardData[];
    setUsers: React.Dispatch<React.SetStateAction<UserCardData[]>>;
    addToSaveUsers: (id: string) => void;
}

const userContext = createContext<ProvidersProps | null>(null);

export function UsersProvider({children}: {children: React.ReactNode}) {
    const [users, setUsers] = useState<UserCardData[]>([]);
    const [saveUsers, setSaveUsers] = useState<UserCardData[]>([]);
    console.log(users)
    const addToSaveUsers = (id: string) => {
        const userToSave = users.find(user => user.id === id);
        if (userToSave && !saveUsers.some(user => user.id === id)) {
            setSaveUsers(prev => [...prev, userToSave]);
        }
    }

    const value = useMemo(
        () => ({ users, saveUsers, setUsers, addToSaveUsers }),
        [users, saveUsers]
    );
    
    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export function useUsersContext() {
    const context = useContext(userContext);
    if (context === null) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
}