import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Assuming AuthContext is set up

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get('/cart');
            setCartItems(res.data.cart?.items || []);
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        
        try {
            const res = await api.post('/cart/add', { productId, quantity });
            setCartItems(res.data.cart.items);
            toast.success('Added to cart!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await api.patch('/cart/update-quantity', { productId, quantity });
            setCartItems(res.data.cart.items);
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await api.delete(`/cart/remove/${productId}`);
            setCartItems(res.data.cart.items);
            toast.success('Item removed');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            getCartTotal,
            getCartCount,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
