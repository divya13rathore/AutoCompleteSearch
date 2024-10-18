import React, { useState, useEffect } from "react";
import jsonData from "../data/DataFile.json";
import "../style/AppStyle.css";
import Select from "react-select";

const AutoComplete = () => {
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Reset the input and selection when cart changes
  useEffect(() => {
    setSearchText("");
    setSelectedBook(null);
  }, [cart]);

  // Function to add selected book to the cart
  const handleAddBookToCart = (selectedBook) => {
    if (!selectedBook) return;

    const author = jsonData.authors.find(
      (author) => author.book_id === selectedBook.id
    )?.author;

    const title = jsonData.titles[selectedBook.id];

    const newCartItem = {
      author: author,
      title: title,
      summary: selectedBook.label,
    };

    // Add new book to cart
    setCart((prevCart) => [...prevCart, newCartItem]);

    // Filter out the added book from jsonData (to mimic item removal)
    jsonData.authors = jsonData.authors.filter(
      (author) => author.book_id !== selectedBook.id
    );
    jsonData.titles = jsonData.titles.filter((_, index) => index !== selectedBook.id);
    jsonData.summaries = jsonData.summaries.filter(
      (summary) => summary.id !== selectedBook.id
    );
  };

  // Function to get filtered book options based on search text
  const getFilteredBookOptions = () => {
    return jsonData.summaries
      .map((summary) => ({
        id: summary.id,
        label: summary.summary,
      }))
      .filter((book) =>
        book.label.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => {
        const countA = (
          a.label.toLowerCase().match(new RegExp(searchText.toLowerCase(), "g")) || []
        ).length;
        const countB = (
          b.label.toLowerCase().match(new RegExp(searchText.toLowerCase(), "g")) || []
        ).length;
        return countB - countA;
      });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col sm:flex-row sm:items-center pb-8">
          <Select
            options={getFilteredBookOptions()}
            placeholder="Search for a book"
            className="w-full sm:w-1/2 pr-4 mb-4 sm:mb-0"
            isClearable={true}
            onInputChange={(inputText) => setSearchText(inputText)}
            inputValue={searchText}
            value={selectedBook}
            onChange={(option) => setSelectedBook(option)}
            styles={{
              control: (provided) => ({
                ...provided,
                padding: "0.5rem",
                borderRadius: "8px",
                border: "2px solid #7c3aed", // Custom border color
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow
              }),
              input: (provided) => ({
                ...provided,
                fontSize: "1rem",
              }),
            }}
          />
          <button
            onClick={() => handleAddBookToCart(selectedBook)}
            disabled={!selectedBook}
            className={`ml-0 sm:ml-4 px-4 py-2 rounded-lg text-white transition-transform transform hover:scale-105 ${
              selectedBook
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 text-gray-800 cursor-not-allowed"
            }`}
          >
            Add To Cart
          </button>
        </div>

        {/* Display the items in the cart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cart.map((book, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow-lg p-4 transition-all duration-300 hover:bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:text-white hover:shadow-2xl flex flex-col justify-between"
              style={{ minHeight: "200px", width: "100%" }} // Wider, taller box
            >
              <div>
                <h3 className="text-lg font-bold mb-2">{book.title}</h3>
                <p>
                  <span className="font-bold">Author: </span>
                  {book.author}
                </p>
                <p className="mt-2">
                  <span className="font-bold">Summary: </span>
                  {book.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoComplete;
