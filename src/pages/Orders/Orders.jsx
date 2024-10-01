import AppContext from "../../components/Contexts/AppContext";
import styles from "./Orders.module.scss";

import { useContext, useEffect, useState } from "react";
import axios from "axios";

function Orders({ searchValue, setSearchValue, onChangeSearchInput }) {
  const { favorites, isItemAdded, isItemFavorited, renderItems } =
    useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://66c8bd008a477f50dc2f2150.mockapi.io/orders"
        );
        setOrders(data);
        setIsLoading(false);
      } catch (error) {
        alert("Ошибка при запросе заказов");
      }
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>
          {searchValue ? `Поиск по запросу: "${searchValue}"` : "Мои заказы"}
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

      <div>
        {orders.toReversed().map((order) => (
          <div>
            <h2 className={styles.orderHeader}>Заказ #{order.id}</h2>
            <div className={styles.cardsList}>
              {renderItems(order.items, isLoading)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
