import { useState, useEffect } from "react";
import { Audiobook } from "../app/api/audio/getAllAudioBooks";
import { SearchAudioByName } from "../app/api/Search/SearchAudiobookByName";
import ResearchRow from './researchRow';
import { fetchAuthorById } from '../app/api/audio/getAuthorById';
import { fetchNarratorById } from '../app/api/audio/getNarratorById';

interface SearchBarProps {
  search: string;
  setSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookList, setBookList] = useState<Audiobook[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: string }>({});
  const [narrators, setNarrators] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (search) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [search]);

  useEffect(() => {
    const loadBooks = async () => {
      let JsonObj = await SearchAudioByName(search);
      setBookList(JsonObj.audiobooks);

      // Fetch author and narrator names for each book in the search result
      const authorPromises = JsonObj.audiobooks.map((book) =>
        fetchAuthorById(book.author).catch(() => ({ name: "Unknown Author" }))
      );
      const narratorPromises = JsonObj.audiobooks.map((book) =>
        fetchNarratorById(book.narrator).catch(() => ({ name: "Unknown Narrator" }))
      );

      // Resolve promises for authors and narrators
      const authorsList = await Promise.all(authorPromises);
      const narratorsList = await Promise.all(narratorPromises);

      // Create a map of author and narrator names
      const authorMap: { [key: string]: string } = {};
      authorsList.forEach((author, index) => {
        authorMap[JsonObj.audiobooks[index].author] = author.name;
      });

      const narratorMap: { [key: string]: string } = {};
      narratorsList.forEach((narrator, index) => {
        narratorMap[JsonObj.audiobooks[index].narrator] = narrator.name;
      });

      setAuthors(authorMap);
      setNarrators(narratorMap);
    };

    if (search) {
      loadBooks();
    }
  }, [search]);

  const handleItemClick = (book: Audiobook) => {
    console.log(`Item clicked: ${book.title}`);
    // You can add navigation or other actions here
  };

  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        placeholder="Rechercher un livre..."
        value={search}
        onChange={async (e) => {
          setSearch(e.target.value); // Update search term
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Small delay to prevent immediate dropdown close
        className="px-4 py-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showDropdown && bookList.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-black border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {bookList
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
                <ResearchRow
                  book={book}
                  author={authors[book.author] || "Unknown Author"}
                  narrator={narrators[book.narrator] || "Unknown Narrator"}
                />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
