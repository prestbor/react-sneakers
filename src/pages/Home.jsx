import { useLocation } from "react-router-dom";
import Card from "../components/Card/Card";
import { HomeContext } from "../App";

import { nanoid } from "@reduxjs/toolkit";
import { useContext } from "react";
import AppContext from "../components/Contexts/AppContext";

function Home({
  items,
  cartItems,
  favorites,
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToFavorites,
  onAddToCart,
  isLoading,
}) {
  const { isItemAdded, isItemFavorited, renderItems } = useContext(AppContext);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>
          {searchValue ? `Поиск по запросу: "${searchValue}"` : "Все кроссовки"}
        </h1>
        <div className="search-block d-flex">
          <img src="img/search.svg" alt="Search" />
          {searchValue && (
            <img
              onClick={() => setSearchValue("")}
              className="clear removeBtn cu-p"
              src="img/btn-remove.svg"
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

      <div className="d-flex flex-wrap">{renderItems(items, isLoading)}</div>
    </div>
  );
}

export default Home;
