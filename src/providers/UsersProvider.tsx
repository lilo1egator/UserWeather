'use client';

import { UserWithWeather } from "@/types/user";
import { useState, useEffect, createContext, useContext, useMemo} from "react";

interface ProvidersProps {
    users: UserWithWeather[];
    saveUsers: UserWithWeather[];
    setUsers: React.Dispatch<React.SetStateAction<UserWithWeather[]>>;
    addToSaveUsers: (user: UserWithWeather) => void;
}

const userContext = createContext<ProvidersProps | null>(null);

const LS_KEY = 'saved_users';

export function UsersProvider({children}: {children: React.ReactNode}) {
    const [users, setUsers] = useState<UserWithWeather[]>([]);
    const [saveUsers, setSaveUsers] = useState<UserWithWeather[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(LS_KEY);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(saveUsers));
    }, [saveUsers]);

    
    const addToSaveUsers = (user: UserWithWeather) => {
        setSaveUsers(prev => {
            if (prev.some(x => x.id === user.id)) return prev;
            return [...prev, user];
        });
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