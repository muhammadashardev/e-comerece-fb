import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await api.get('/wishlist');
            setWishlistItems(res.data.wishlist?.products || []);
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error('Please login to manage wishlist');
            return;
        }
        
        try {
            const res = await api.post('/wishlist/toggle', { productId });
            setWishlistItems(res.data.wishlist?.products || []);
            
            // Check if added or removed by looking at the new items list
            const isAdded = res.data.wishlist?.products.some(p => p._id === productId);
            if (isAdded) {
               toast.success('Added to wishlist');
            } else {
               toast.success('Removed from wishlist');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const res = await api.delete(`/wishlist/remove/${productId}`);
            setWishlistItems(res.data.wishlist?.products || []);
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            loading,
            toggleWishlist,
            removeFromWishlist,
            isInWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
