import { useContext, useState } from "react";
import Info from "../Info/Info";
import styles from "./Drawer.module.scss";
import AppContext from "../Contexts/AppContext";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ items = [], onClose, onRemove, opened }) {
  const { cartItems, setCartItems, totalPrice } = useContext(AppContext);
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tax = totalPrice * 0.05;

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://66c8bd008a477f50dc2f2150.mockapi.io/orders",
        {
          items: cartItems,
        }
      );
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          `https://66bdcf0174dfc195586daeca.mockapi.io/cart/${item.id}`
        );
        await delay(1000);
      }
    } catch (error) {
      alert("Не удалось создать заказ");
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина
          <img
            onClick={onClose}
            className={styles.removeBtn}
            src="img/btn-remove.svg"
            alt="Remove"
          />
        </h2>

        {items.length > 0 ? (
          <div className={styles.cartNotEmptyContainer}>
            <div className={styles.items}>
              {items.map((obj) => (
                <div
                  className={`${
                    styles.cartItem
                  } ${"d-flex"} ${"align-center"} ${"mb-20"}`}
                >
                  <img
                    className={styles.cartItemImg}
                    src={obj.imageUrl}
                    alt="Sneakers"
                  />
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>
                  <img
                    onClick={() => {
                      onRemove(obj.id);
                    }}
                    className={styles.removeBtn}
                    src="img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>

            <div className={styles.cartTotalBlock}>
              <ul>
                <li className="d-flex">
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>
                <li className="d-flex">
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{tax.toFixed(2)} руб. </b>
                </li>
              </ul>

              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className={styles.greenButton}
              >
                Оформить заказ
                <img src="img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
            image={
              isOrderComplete
                ? "/img/completed-order.png"
                : "/img/cart-empty.jpg"
            }
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
            }
          />
        )}
      </div>
    </div>
  );
}

export default Drawer;
