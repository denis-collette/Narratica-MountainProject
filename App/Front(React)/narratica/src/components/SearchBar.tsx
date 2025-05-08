import { useState, useEffect } from "react";
import { Audiobook } from "../app/api/audio/getAllAudioBooks";
import{SearchAudioByName} from "../app/api/Search/SearchAudiobookByName"
import ResearchRow from './researchRow';
interface SearchBarProps {
  search: string;
  setSearch: (term: string) => void;
}

// refresh with name here


const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
const [showDropdown, setShowDropdown] = useState(false);
const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
const [bookList, setBookList] = useState<Audiobook[]>([])


useEffect(() => {
    if (search) {
    setShowDropdown(true);
    } else {
    setFilteredBooks([]);
    setShowDropdown(false);
    }
}, [search]);
console.log(JSON.stringify(bookList))

return (
    <div className="relative w-full sm:w-64">
    <input
        type="text"
        placeholder="Rechercher un livre..."
        value={search}
        onChange={async (e) => {
            setSearch(e.target.value); // Update search term
            let JsonObj = await SearchAudioByName(e.target.value)
            setBookList(JsonObj.audiobooks); // Update book list based on search term
        }}
        
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Small delay to prevent immediate dropdown close
        className="px-4 py-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {showDropdown && bookList.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-black border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            
       {Object.values(bookList) // Convert the object to an array of book values
            .filter((book) =>
            book?.title?.toLowerCase().includes(search.toLowerCase())
            )
            .map((book, index) => (
                <li key={index} className="px-4 py-2">
                <ResearchRow book={book} />
              </li>
))}
        </ul>
    )}
    </div>
    );
};

export default SearchBar;
