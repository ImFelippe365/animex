import React, { createContext } from 'react';

export const MyContext = createContext({});

export default function ContextProvider({ children }:any ) {

    return <MyContext.Provider value={{
        position: 0
    }}> {children} </MyContext.Provider>



}