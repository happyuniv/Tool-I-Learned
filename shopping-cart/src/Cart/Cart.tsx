import { useState } from "react";
import styled from "styled-components";
import { CartItemType } from "../App";
import CartItem from "./CartItem";

type props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};
const Wrapper = styled.aside`
  font-family: Arial, Helvetica, sans-serif;
  width: 500px;
  padding: 20px;
`;
const Cart = ({ cartItems, addToCart, removeFromCart }: props) => {
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <Wrapper>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Empty Items</p>
      ) : (
        cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))
      )}
    </Wrapper>
  );
};

export default Cart;
