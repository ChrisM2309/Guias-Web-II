import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Guitar } from './components/Guitar'
import { db } from './data/db'


export const App = () => {

  function initialCart() {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }
  const [data, setData] = useState(db);
  const [cart, setCart] = useState(initialCart);
  // use effect maneja los efectos secundarios de cada cambio en la variable de estado cart 
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart])

  // funcion agregar item al Carrito 
  function addToCart(guitar) {
    const itemIndex = cart.findIndex((item) => guitar.id === item.id);
    if (itemIndex === -1) {
      // la guitarra no estaba en el carrito
      guitar.quantity = 1;
      setCart([...cart, guitar]);
    }
    else {
      // si la guitara ya estaba en el carrito 
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity++;
      setCart(updatedCart)
    }
  }

  // funcion para calcular total 
  function calculateTotal() {
    let total = cart.reduce((total, item) => total += item.quantity * item.price, 0)
    return total;
  }

  // funciones para agregar productos, quitar, eliminar  y vaciar carrito 

  function addProduct(guitar) {
    const itemIndex = cart.findIndex((item) => guitar.id === item.id);
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity++;
    setCart(updatedCart);
  }

  function deleteProduct(guitar) {
    const updatedCart = cart.filter(item => item.id !== guitar.id);
    console.log(updatedCart);
    setCart(updatedCart);
  }

  function reduceProduct(guitar) {
    const itemIndex = cart.findIndex((item) => guitar.id === item.id);
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity--;

    // si la cantidad llega a cero o menos debe de eliminarse de la lista 
    if (updatedCart[itemIndex].quantity <= 0) {
      deleteProduct(guitar);
    } else {
      setCart(updatedCart);
    }
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <>
      <Header cart={cart} total={calculateTotal()} addProduct={addProduct} reduceProduct={reduceProduct} deleteProduct={deleteProduct} clearCart={clearCart} />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
          {data.map((guitar) =>
            (<Guitar guitar={guitar} key={guitar.id} addToCart={addToCart} />)
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
