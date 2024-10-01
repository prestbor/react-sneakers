import React, { useContext } from "react";
import AppContext from "../Contexts/AppContext";
import styles from "./Info.module.scss";

import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

const Info = ({ title, image, description }) => {
  const { setCartOpened } = useContext(AppContext);

  return (
    <div className={styles.emptyCart}>
      <img className={styles.cartImg} src={image} alt="Empty cart" />
      <h2 className={styles.cartHeader}>{title}</h2>
      <p className={styles.cartDesc}>{description}</p>
      <button
        onClick={() => {
          enableBodyScroll(document);
          setCartOpened(false);
        }}
        className={styles.greenButton}
      >
        <img
          className={styles.greenBtnBackArrow}
          src="img/arrow-left.svg"
          alt="Arrow"
        />
        Вернуться назад
      </button>
    </div>
  );
};

export default Info;
