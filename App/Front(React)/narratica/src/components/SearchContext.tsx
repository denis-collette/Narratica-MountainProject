"use client";
import React, { createContext, useContext, useState } from 'react';

interface SearchContextProps {
    search: string;
    setSearch: (books: string) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState('');

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): SearchContextProps => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('Erreur avec la recherche');
    }
    return context;
};