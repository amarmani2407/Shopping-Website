import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  SavedItem,
  Order,
  User,
  Address,
  Toast,
  OrderStatus,
  ProductReview,
} from '../types';
import { ALL_PRODUCTS } from '../data/mockProducts';
import { DEMO_USER, DEMO_ADDRESSES, INITIAL_ORDERS, VALID_COUPONS } from '../data/mockUserData';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  savedForLater: SavedItem[];
  wishlist: string[];
  orders: Order[];
  user: User | null;
  deliveryLocation: { city: string; pincode: string };
  appliedCoupon: { code: string; discountPercent: number } | null;
  darkMode: boolean;
  recentlyViewed: string[];
  toasts: Toast[];

  // Cart operations
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  saveForLater: (productId: string, selectedVariants?: Record<string, string>) => void;
  moveToCartFromSaved: (productId: string, selectedVariants?: Record<string, string>) => void;
  removeFromSaved: (productId: string, selectedVariants?: Record<string, string>) => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  createOrder: (data: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
    paymentDetails?: string;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    totalAmount: number;
  }) => Order;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Products (Admin/Seller)
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // User & Addresses
  login: (email: string, name?: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setDeliveryLocation: (city: string, pincode: string) => void;

  // Navigation / History / Toast / Theme
  addRecentlyViewed: (productId: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize states with localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopnest_products');
      return saved ? JSON.parse(saved) : ALL_PRODUCTS;
    } catch {
      return ALL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopnest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopnest_saved_later');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopnest_wishlist');
      return saved ? JSON.parse(saved) : ['elec-01', 'fash-01'];
    } catch {
      return ['elec-01', 'fash-01'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shopnest_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('shopnest_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [deliveryLocation, setDeliveryLocationState] = useState<{ city: string; pincode: string }>(() => {
    try {
      const saved = localStorage.getItem('shopnest_location');
      return saved ? JSON.parse(saved) : { city: 'Mumbai', pincode: '400018' };
    } catch {
      return { city: 'Mumbai', pincode: '400018' };
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopnest_recent');
      return saved ? JSON.parse(saved) : ['elec-01', 'fash-02', 'home-01', 'book-01'];
    } catch {
      return ['elec-01', 'fash-02', 'home-01', 'book-01'];
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shopnest_darkmode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('shopnest_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopnest_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopnest_saved_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem('shopnest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopnest_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopnest_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shopnest_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    localStorage.setItem('shopnest_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('shopnest_darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast notification system
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Helper matching variant keys
  const matchVariants = (v1?: Record<string, string>, v2?: Record<string, string>) => {
    if (!v1 && !v2) return true;
    if (!v1 || !v2) return false;
    const keys1 = Object.keys(v1);
    const keys2 = Object.keys(v2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every((key) => v1[key] === v2[key]);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && matchVariants(item.selectedVariants, selectedVariants)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedVariants }];
      }
    });

    addToast(`Added "${product.title.slice(0, 30)}..." to your Cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedVariants?: Record<string, string>) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariants);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && matchVariants(item.selectedVariants, selectedVariants)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedVariants?: Record<string, string>) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && matchVariants(item.selectedVariants, selectedVariants))
      )
    );
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveForLater = (productId: string, selectedVariants?: Record<string, string>) => {
    const itemToSave = cart.find(
      (item) => item.product.id === productId && matchVariants(item.selectedVariants, selectedVariants)
    );

    if (itemToSave) {
      setSavedForLater((prev) => [
        ...prev,
        {
          product: itemToSave.product,
          selectedVariants: itemToSave.selectedVariants,
          savedAt: new Date().toISOString(),
        },
      ]);
      removeFromCart(productId, selectedVariants);
      addToast('Saved for later', 'info');
    }
  };

  const moveToCartFromSaved = (productId: string, selectedVariants?: Record<string, string>) => {
    const item = savedForLater.find(
      (s) => s.product.id === productId && matchVariants(s.selectedVariants, selectedVariants)
    );
    if (item) {
      addToCart(item.product, 1, item.selectedVariants);
      removeFromSaved(productId, selectedVariants);
    }
  };

  const removeFromSaved = (productId: string, selectedVariants?: Record<string, string>) => {
    setSavedForLater((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && matchVariants(item.selectedVariants, selectedVariants))
      )
    );
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from your Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Added to your Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const upper = code.trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      const discount = VALID_COUPONS[upper];
      setAppliedCoupon({ code: upper, discountPercent: discount });
      addToast(`Coupon "${upper}" applied! ${discount}% OFF`, 'success');
      return { success: true, message: `Coupon applied: ${discount}% discount` };
    }
    addToast('Invalid coupon code. Try SAVE10 or WELCOME20', 'error');
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Orders
  const createOrder = (data: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
    paymentDetails?: string;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    totalAmount: number;
  }): Order => {
    const orderId = `SN-${Math.floor(10000 + Math.random() * 90000)}-IN`;
    const now = new Date();
    const deliveryDateObj = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const estDelivery = deliveryDateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const newOrder: Order = {
      id: orderId,
      date: now.toISOString(),
      items: data.items,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails,
      status: 'ordered',
      subtotal: data.subtotal,
      discount: data.discount,
      deliveryFee: data.deliveryFee,
      tax: data.tax,
      totalAmount: data.totalAmount,
      estimatedDeliveryDate: `Expected by ${estDelivery}`,
      trackingUpdates: [
        {
          status: 'ordered',
          label: 'Order Confirmed',
          date: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          detail: `Verified payment via ${data.paymentMethod}`,
        },
        {
          status: 'shipped',
          label: 'Packing at Fulfillment Hub',
          date: 'Upcoming',
          completed: false,
          detail: 'Item is being inspected and prepared for transit',
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          date: 'Upcoming',
          completed: false,
        },
        {
          status: 'delivered',
          label: 'Delivered',
          date: estDelivery,
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    addToast(`Order placed successfully! Order ID: ${orderId}`, 'success');
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'cancelled',
            trackingUpdates: [
              ...order.trackingUpdates,
              {
                status: 'cancelled',
                label: 'Order Cancelled',
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                completed: true,
                detail: 'Cancelled by customer. Refund initiated to source account.',
              },
            ],
          };
        }
        return order;
      })
    );
    addToast(`Order ${orderId} cancelled`, 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedSteps = order.trackingUpdates.map((step) => {
            if (step.status === status) {
              return { ...step, completed: true, date: 'Updated Just Now' };
            }
            return step;
          });
          return { ...order, status, trackingUpdates: updatedSteps };
        }
        return order;
      })
    );
    addToast(`Order ${orderId} marked as ${status.replace('_', ' ')}`, 'success');
  };

  // Products
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newId = `custom-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      reviews: newProdData.reviews || [],
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product "${newProduct.title}" created successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    addToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product removed from catalog', 'info');
  };

  const addProductReview = (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => {
    const fullReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [fullReview, ...p.reviews];
          const avgRating =
            Math.round(
              (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10
            ) / 10;
          return {
            ...p,
            reviews: updatedReviews,
            rating: avgRating,
            ratingCount: p.ratingCount + 1,
          };
        }
        return p;
      })
    );
    addToast('Thank you! Your verified review has been submitted.', 'success');
  };

  // User Auth & Profiles
  const login = (email: string, name = 'Valued Customer', role: 'customer' | 'admin' = 'customer') => {
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
      email,
      phone: '+91 98765 00000',
      role,
      addresses: DEMO_ADDRESSES,
      defaultAddressId: DEMO_ADDRESSES[0].id,
    };
    setUser(newUser);
    addToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    addToast('Logged out of ShopNest', 'info');
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    if (!user) return;
    const newId = `addr-${Date.now()}`;
    const newAddr: Address = { ...addr, id: newId };
    const updated = [...user.addresses, newAddr];
    setUser({ ...user, addresses: updated });
    addToast('New address saved', 'success');
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (!user) return;
    const updated = user.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setUser({ ...user, addresses: updated });
    addToast('Address updated', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.filter((a) => a.id !== id);
    setUser({ ...user, addresses: updated });
    addToast('Address deleted', 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setUser({ ...user, addresses: updated, defaultAddressId: id });
    const selected = user.addresses.find((a) => a.id === id);
    if (selected) {
      setDeliveryLocationState({ city: selected.city, pincode: selected.pincode });
    }
    addToast('Default delivery address updated', 'success');
  };

  const setDeliveryLocation = (city: string, pincode: string) => {
    setDeliveryLocationState({ city, pincode });
    addToast(`Delivery destination set to ${city} (${pincode})`, 'info');
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 12);
    });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        savedForLater,
        wishlist,
        orders,
        user,
        deliveryLocation,
        appliedCoupon,
        darkMode,
        recentlyViewed,
        toasts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        saveForLater,
        moveToCartFromSaved,
        removeFromSaved,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        createOrder,
        cancelOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addProductReview,
        login,
        logout,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        setDeliveryLocation,
        addRecentlyViewed,
        addToast,
        removeToast,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
