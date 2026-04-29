import { useState } from "react";

const SearchBar = ({ onSearch, city }) => {
  const [inputValue, setInputValue] = useState(city);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input 
        type="text" 
        placeholder="Поиск города..." 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
};

export default SearchBar;