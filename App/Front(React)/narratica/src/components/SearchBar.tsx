import React from 'react';
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    search: string;
    setSearch: (books: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
    return (
        <section className="flex items-center bg-neutral-800 rounded-full w-full sm:w-64 border border-transparent hover:border-neutral-500">
            <FaSearch className="ml-2 text-white-500" />
            <input
                type="text"
                placeholder="Que souhaitez-vous écouter ?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 w-full outline-none"
            />
        </section>
    );
};

export default SearchBar;