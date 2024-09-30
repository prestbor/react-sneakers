import { Outlet, Route, Routes } from "react-router-dom";
import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import { createContext, useEffect, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import Card from "./components/Card/Card";
import Favorites from "./pages/Favorites";
import AppContext from "./components/Contexts/AppContext";
import Orders from "./pages/Orders/Orders";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const totalPrice = cartItems.reduce((sum, obj) => sum + obj.price, 0);

  useEffect(() => {
    // setIsLoading(true);
    axios
      .get("https://66bdcf0174dfc195586daeca.mockapi.io/items")
      .then((res) => {
        setItems(res.data);
      });
    axios
      .get("https://66bdcf0174dfc195586daeca.mockapi.io/cart")
      .then((res) => {
        setCartItems(res.data);
      });
    axios
      .get("https://66c8bd008a477f50dc2f2150.mockapi.io/favorites")
      .then((res) => {
        setFavorites(res.data);
      });
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [cartResponse, favoritesResponse, itemResponse] =
  //         await Promise.all([
  //           axios.get("https://66bdcf0174dfc195586daeca.mockapi.io/cart"),
  //           axios.get("https://66c8bd008a477f50dc2f2150.mockapi.io/favorites"),
  //           axios.get("https://66bdcf0174dfc195586daeca.mockapi.io/items"),
  //         ]);

  //       // setIsLoading(false);
  //       setCartItems(cartResponse.data);
  //       setFavorites(favoritesResponse.data);
  //       setItems(itemResponse.data);
  //     } catch (error) {
  //       alert("Ошибка при запросе данных");
  //       console.log(error);
  //     }
  //   }
  // });

  const onAddToCart = async (obj) => {
    try {
      setCartItems((prev) => [...prev, obj]);
      await axios.post("https://66bdcf0174dfc195586daeca.mockapi.io/cart", obj);
      await axios
        .get("https://66bdcf0174dfc195586daeca.mockapi.io/cart")
        .then((res) => {
          setCartItems(res.data);
        });
    } catch (error) {
      alert("Ошибка при добавлении товара в корзину");
      console.log(error);
    }
  };

  const onRemoveItem = async (id) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      await axios.delete(
        `https://66bdcf0174dfc195586daeca.mockapi.io/cart/${id}`
      );
    } catch (error) {
      alert("Ошибка при удалении товара из корзины");
      console.log(error);
    }
  };

  const onAddToFavorites = async (obj) => {
    try {
      const favDelObj = favorites.find((fav) => fav.gId === obj.gId);
      if (favDelObj) {
        setFavorites((prev) => prev.filter((item) => item.gId !== obj.gId));
        await axios.delete(
          `https://66c8bd008a477f50dc2f2150.mockapi.io/favorites/${favDelObj.id}`
        );
      } else {
        setFavorites((prev) => [...prev, obj]);
        const { data } = await axios.post(
          "https://66c8bd008a477f50dc2f2150.mockapi.io/favorites",
          obj
        );
        setFavorites((prev) => prev.filter((item) => item.gId !== obj.gId));
        setFavorites((prev) => [...prev, data]);
        // setFavorites((prev) => [...prev, obj]);
      }
    } catch (error) {
      alert("Не удалось добавить в фавориты");
      console.log(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (gId) => {
    return cartItems.some((obj) => obj.gId === gId);
  };

  const isItemFavorited = (gId) => {
    return favorites.some((obj) => obj.gId === gId);
  };

  const renderItems = (cards, load) => {
    const filtredItems = cards.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (load ? [...Array(20)] : filtredItems).map((item) => (
      <Card
        key={nanoid()}
        onFavorite={(obj) => onAddToFavorites(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        added={isItemAdded(item && item.gId)}
        favorited={isItemFavorited(item && item.gId)}
        loading={load}
        {...item}
      />
    ));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        totalPrice,
        renderItems,
        isItemAdded,
        isItemFavorited,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => {
            enableBodyScroll(document);
            setCartOpened(false);
          }}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header
          onClickCart={() => {
            setCartOpened(true);
            disableBodyScroll(document);
            window.scrollTo(0, 0);
          }}
        />
        <div id="items">
          <Outlet />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                items={items}
                cartItems={cartItems}
                favorites={favorites}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorites={onAddToFavorites}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <Favorites
                // items={favorites}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToCart={onAddToCart}
                onAddToFavorites={onAddToFavorites}
                isLoading={isLoading}
              />
            }
          />

          <Route
            path="/orders"
            element={
              <Orders
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToCart={onAddToCart}
                onAddToFavorites={onAddToFavorites}
              />
            }
          />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
