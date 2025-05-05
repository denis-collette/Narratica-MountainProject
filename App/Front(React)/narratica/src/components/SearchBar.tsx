import React from 'react';

interface SearchBarProps {
    search: string;
    setSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
    return (
        <input
            type="text"
            placeholder="Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded border w-full sm:w-64"
        />
    );
};

export default SearchBar;