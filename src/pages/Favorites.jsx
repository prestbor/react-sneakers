import AppContext from "../components/Contexts/AppContext";

import { useContext, useState } from "react";

function Favorites({ searchValue, setSearchValue, onChangeSearchInput }) {
  const { favorites, isItemAdded, renderItems } = useContext(AppContext);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>
          {searchValue ? `Поиск по запросу: "${searchValue}"` : "Мои закладки"}
        </h1>
        <div className="search-block d-flex">
          <img src="/img/search.svg" alt="Search" />
          {searchValue && (
            <img
              onClick={() => setSearchValue("")}
              className="clear removeBtn cu-p"
              src="/img/btn-remove.svg"
              alt="Clear"
            />
          )}
          <input
            onChange={onChangeSearchInput}
            value={searchValue}
            placeholder="Поиск..."
            maxLength={60}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap">{renderItems(favorites)}</div>
    </div>
  );
}

export default Favorites;
