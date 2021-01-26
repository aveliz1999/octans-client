import React from 'react';
import {UserContextProvider} from "./context/User";
import AppRouter from "./AppRouter";

export default function App() {
  return <UserContextProvider>
    <AppRouter/>
  </UserContextProvider>
}
