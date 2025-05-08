import { useState, useEffect } from "react";
import { Audiobook } from "../app/api/audio/getAllAudioBooks";
import { SearchAudioByName } from "../app/api/Search/SearchAudiobookByName";
import ResearchRow from './researchRow';

interface SearchBarProps {
  search: string;
  setSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookList, setBookList] = useState<Audiobook[]>([]);

  useEffect(() => {
    if (search) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [search]);

  const handleItemClick = (book: Audiobook) => {
    console.log(`Item clicked: ${book.title}`);
    // Add any action you want to perform on click here, for example:
    // Navigate to the book details page, etc.
  };

  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        placeholder="Rechercher un livre..."
        value={search}
        onChange={async (e) => {
          setSearch(e.target.value); // Update search term
          let JsonObj = await SearchAudioByName(e.target.value);
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
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-[rgb(43,43,43)] hover:text-white active:bg-[rgb(94,94,94)]"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur on clicking a dropdown item
                }}
                onClick={() => handleItemClick(book)} // Call handleItemClick on click
              >
                <ResearchRow book={book} />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
