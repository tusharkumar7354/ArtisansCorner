import CartItem from "./CartItem";

const CartTable = ({ items, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <CartItem
          key={item.product._id}
          item={item}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
          onRemove={() => onRemove(item)}
        />
      ))}
    </div>
  );
};

export default CartTable;

