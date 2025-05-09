import Link from 'next/link';
import { useState, useEffect } from "react";
import { Audiobook } from "../app/api/audio/getAllAudioBooks";
import { SearchAudioByName } from "../app/api/Search/SearchAudiobookByName";
import ResearchRow from './researchRow';
import { fetchAuthorById } from '../app/api/audio/getAuthorById';
import { fetchNarratorById } from '../app/api/audio/getNarratorById';
import { FaSearch } from "react-icons/fa";
import {Author} from "../app/api/audio/getAuthorById"
import {Narrator} from "../app/api/audio/getNarratorById" 

interface SearchBarProps {
    search: string;
    setSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookList, setBookList] = useState<Audiobook[]>([]);
  const [narratorList, setNarratorList] = useState<Narrator[]>([]);
  const [authorList, setAuthorList] = useState<Author[]>([]);
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
      setAuthorList(JsonObj.authors);
      setNarratorList(JsonObj.narrators);

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


    return (
        <section className="relative w-full sm:w-64">
            <div className="relative flex items-center">
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-white" />
                <input
                    type="text"
                    placeholder="Que souhaitez-vous écouter ?"
                    value={search}
                    onChange={async (e) => {
                        setSearch(e.target.value); // Update search term
                        let JsonObj = await SearchAudioByName(e.target.value);
                        setBookList(JsonObj.audiobooks); // Update book list based on search term
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Small delay to prevent immediate dropdown close
                    className="pl-8 py-2 bg-neutral-800 rounded-full w-full sm:w-64 border border-transparent hover:border-neutral-500 focus:outline-none"
                />
            </div>

            {showDropdown && (bookList.length > 0 || authorList.length > 0 || narratorList.length > 0) && (
              <ul className="absolute z-10 w-full mt-1 bg-black border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">

                {/* Book Results */}
                {bookList.length > 0 && (
                  <>
                    <div className='text-center font-semibold text-white'>--- Books ---</div>
                    {bookList
                      .filter((book) =>
                        book?.title?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((book, index) => (
                        <li
                          key={`book-${index}`}
                          className="px-4 py-2 cursor-pointer hover:bg-[rgb(43,43,43)] hover:text-white active:bg-[rgb(94,94,94)]"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <ResearchRow
                            book={book}
                            author={authors[book.author] || "Unknown Author"}
                            narrator={narrators[book.narrator] || "Unknown Narrator"}
                          />
                        </li>
                      ))}
                  </>
                )}

                {/* Author Results */}
                {authorList.length > 0 && (
                  <>
                    <div className='text-center font-semibold text-white'>--- Authors ---</div>
                    {authorList.map((author) => (
                      <div
                        key={`author-${author.id}`}
                        className='cursor-pointer hover:bg-[rgb(43,43,43)] hover:text-white active:bg-[rgb(94,94,94)]'
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Link href={{ pathname: "/authorView", query: { id: author.id } }}>
                          <li className='pl-2 list-none'>{author.name}</li>
                        </Link>
                      </div>
                    ))}
                  </>
                )}

                {/* Narrator Results */}
                {narratorList.length > 0 && (
                  <>
                    <div className='text-center font-semibold text-white'>--- Narrators ---</div>
                    {narratorList.map((narrator) => (
                      <div
                        key={`narrator-${narrator.id}`}
                        className='cursor-pointer hover:bg-[rgb(43,43,43)] hover:text-white active:bg-[rgb(94,94,94)]'
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Link href={{ pathname: "/authorView", query: { id: narrator.id } }}>
                          <li className='pl-2 list-none'>{narrator.name}</li>
                        </Link>
                      </div>
                    ))}
                  </>
                )}
              </ul>
            )}

    </section>
  );
};

export default SearchBar;
