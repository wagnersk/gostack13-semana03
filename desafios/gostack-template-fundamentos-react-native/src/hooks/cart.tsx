import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productStorage = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      // AsyncStorage.clear();

      if (productStorage) {
        setProducts(JSON.parse(productStorage));
      }

      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      /* 1- procura se existe já o array
         2- caso exista eu adiciono a quantity +1 na propriedade dele
         3- caso não exista eu adiciono a propriedade quantity = 0
         4- caso ele exista eu preciso remover no meu array de products ele com filter
         5-Agora eu posso salvar com o set antes de salvar com o Set
      */
      // 1
      const getProductAlreadyExists = products.find(
        productToFind => productToFind.id === product.id,
      );

      // 2 e 3
      getProductAlreadyExists
        ? (getProductAlreadyExists.quantity += 1)
        : (product.quantity = 1);

      // aqui eu estou removendo para nao ter duplicada no array final
      const removedOfOldArrayTheProduct = products.filter(
        filterProduct => filterProduct.id !== product.id,
      );

      // se ele ja existir ele pega o array sem duplicada e adiciona o novo+ quantidade somada
      // se nao ele pega o velho e soma com o array recebido e quantidade 0
      getProductAlreadyExists
        ? setProducts([...removedOfOldArrayTheProduct, getProductAlreadyExists])
        : setProducts([...products, product]);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );

      // TODO ADD A NEW ITEM TO THE CART
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const findIndexToIncrement = products.findIndex(
        product => product.id === id,
      );

      if (findIndexToIncrement >= 0) {
        products[findIndexToIncrement].quantity += +1;
      }

      setProducts([...products]);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );

      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const findIndexToDecrement = products.findIndex(
        product => product.id === id,
      );

      if (products[findIndexToDecrement].quantity > 0) {
        products[findIndexToDecrement].quantity -= 1;
        setProducts([...products]);
      }

      if (products[findIndexToDecrement].quantity < 1) {
        products.splice(findIndexToDecrement, 1);
        setProducts([...products]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
