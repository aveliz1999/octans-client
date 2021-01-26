import React, {useState, createContext, Dispatch, SetStateAction} from "react";

type User = {
    id: number,
    username: string,
    createdAt: string,
    updatedAt: string
}

export const UserContext = createContext<[User | undefined, Dispatch<SetStateAction<User | undefined>> | undefined]>([undefined, undefined]);

export const UserContextProvider = (props: { children: React.ReactNode; }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    return <UserContext.Provider value={[user, setUser]}>
        {
            props.children
        }
    </UserContext.Provider>
}