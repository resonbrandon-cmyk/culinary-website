import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  UserProfile,
  DeliveryAddress,
  SelectedOption,
  CustomerSummary,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_USER,
  INITIAL_CUSTOMERS,
  PROMO_CODES,
} from '../data/mockData';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { generateOrderNumber } from '../utils/format';

export type PageRoute =
  | 'home'
  | 'menu'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'orders'
  | 'login'
  | 'register'
  | 'account'
  | 'about'
  | 'contact'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-orders'
  | 'admin-customers'
  | '404';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation
  currentPage: PageRoute;
  navigate: (page: PageRoute, params?: { productId?: string; orderId?: string }) => void;
  selectedProductId: string | null;
  trackedOrderId: string | null;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;

  // Active product modal / PDP
  activeModalProduct: Product | null;
  setActiveModalProduct: (product: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedOptions?: SelectedOption[],
    specialInstructions?: string
  ) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Cart calculations & promotions
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  promoCode: string;
  appliedPromo: { code: string; label: string; discount: number } | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  total: number;

  // Orders
  orders: Order[];
  createOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address?: DeliveryAddress;
    paymentMethod: 'card' | 'apple_pay' | 'cash';
    paymentLast4?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorder: (orderId: string) => void;

  // Customers (Admin)
  customers: CustomerSummary[];

  // Auth & Profile
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  registerUser: (name: string, email: string, phone: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addDeliveryAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  deleteDeliveryAddress: (addressId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() =>
    getStorageItem('savor_products', INITIAL_PRODUCTS)
  );

  useEffect(() => {
    setStorageItem('savor_products', products);
  }, [products]);

  // Product modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorageItem('savor_cart', [])
  );
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; label: string; discount: number } | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(4.00);

  useEffect(() => {
    setStorageItem('savor_cart', cart);
  }, [cart]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() =>
    getStorageItem('savor_orders', INITIAL_ORDERS)
  );

  useEffect(() => {
    setStorageItem('savor_orders', orders);
  }, [orders]);

  // Customers
  const [customers, setCustomers] = useState<CustomerSummary[]>(() =>
    getStorageItem('savor_customers', INITIAL_CUSTOMERS)
  );

  useEffect(() => {
    setStorageItem('savor_customers', customers);
  }, [customers]);

  // User Auth
  const [user, setUser] = useState<UserProfile | null>(() =>
    getStorageItem('savor_user', INITIAL_USER)
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStorageItem('savor_user', INITIAL_USER));

  useEffect(() => {
    if (user) {
      setStorageItem('savor_user', user);
    }
  }, [user]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation helper
  const navigate = (page: PageRoute, params?: { productId?: string; orderId?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.productId) {
      setSelectedProductId(params.productId);
      const prod = products.find((p) => p.id === params.productId);
      if (prod) setActiveModalProduct(prod);
    }
    if (params?.orderId) {
      setTrackedOrderId(params.orderId);
    }
    setCurrentPage(page);
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    quantity: number,
    selectedOptions: SelectedOption[] = [],
    specialInstructions?: string
  ) => {
    const optionsCost = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
    const unitPrice = product.price + optionsCost;
    const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newItem: CartItem = {
      cartItemId,
      productId: product.id,
      name: product.name,
      price: unitPrice * quantity,
      unitPrice,
      quantity,
      image: product.image,
      selectedOptions,
      specialInstructions,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${quantity}x ${product.name} to cart`, 'success');
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              price: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Subtotal and Totals
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    return appliedPromo.discount;
  }, [appliedPromo]);

  const deliveryFee = useMemo(() => {
    if (deliveryType === 'pickup') return 0;
    if (appliedPromo?.code === 'FREEDELIVERY') return 0;
    if (subtotal >= 45) return 0; // Free delivery over $45!
    return subtotal > 0 ? 3.99 : 0;
  }, [deliveryType, appliedPromo, subtotal]);

  const tax = useMemo(() => {
    const taxable = Math.max(0, subtotal - discount);
    return Math.round(taxable * 0.0875 * 100) / 100; // 8.75% tax
  }, [subtotal, discount]);

  const total = useMemo(() => {
    const calculated = subtotal - discount + deliveryFee + tax + (deliveryType === 'delivery' ? tipAmount : 0);
    return Math.max(0, Math.round(calculated * 100) / 100);
  }, [subtotal, discount, deliveryFee, tax, tipAmount, deliveryType]);

  const applyPromoCode = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const found = PROMO_CODES[trimmed];
    if (!found) {
      showToast('Invalid coupon code', 'error');
      return false;
    }

    if (found.minOrder && subtotal < found.minOrder) {
      showToast(`Promo requires a minimum order of $${found.minOrder.toFixed(2)}`, 'error');
      return false;
    }

    let calculatedDiscount = 0;
    if (found.type === 'percent') {
      calculatedDiscount = (subtotal * found.value) / 100;
    } else if (found.type === 'fixed') {
      calculatedDiscount = found.value;
    } else if (found.type === 'free_shipping') {
      calculatedDiscount = deliveryFee;
    }

    setAppliedPromo({
      code: trimmed,
      label: found.label,
      discount: calculatedDiscount,
    });
    setPromoCode(trimmed);
    showToast(`Promo applied: ${found.label}`, 'success');
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    showToast('Promo code removed', 'info');
  };

  // Product mutations (Admin)
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to menu`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const toggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = !p.inStock;
          showToast(`${p.name} is now ${nextStock ? 'Available' : 'Sold Out (86)'}`, 'info');
          return { ...p, inStock: nextStock };
        }
        return p;
      })
    );
  };

  // Order Operations
  const createOrder = (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address?: DeliveryAddress;
    paymentMethod: 'card' | 'apple_pay' | 'cash';
    paymentLast4?: string;
  }): Order => {
    const orderNumber = generateOrderNumber();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      tax,
      tip: deliveryType === 'delivery' ? tipAmount : 0,
      total,
      deliveryType,
      address: orderPayload.address,
      estimatedDeliveryTime: '25-35 mins',
      paymentMethod: orderPayload.paymentMethod,
      paymentLast4: orderPayload.paymentLast4 || '4242',
      customerName: orderPayload.customerName,
      customerPhone: orderPayload.customerPhone,
      customerEmail: orderPayload.customerEmail,
      driver: {
        name: 'Carlos Mendez',
        phone: '(415) 555-8921',
        vehicle: 'Midnight Blue Prius (Plate 7SAV98)',
        rating: 4.95,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        currentLocationLat: 37.7749,
        currentLocationLng: -122.4194,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackedOrderId(newOrder.id);
    navigate('order-tracking', { orderId: newOrder.id });
    showToast(`Order ${orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            estimatedDeliveryTime:
              status === 'delivered'
                ? 'Delivered'
                : status === 'out_for_delivery'
                ? '5-10 mins'
                : status === 'preparing'
                ? '15-20 mins'
                : order.estimatedDeliveryTime,
          };
        }
        return order;
      })
    );
    showToast(`Order status updated to "${status.replace(/_/g, ' ')}"`, 'info');
  };

  const reorder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    // Add all items back into cart
    setCart((prev) => [...prev, ...target.items.map((i) => ({ ...i, cartItemId: `${i.productId}-${Date.now()}-${Math.random()}` }))]);
    setIsCartDrawerOpen(true);
    showToast('Items from previous order added to cart', 'success');
  };

  // Auth & Profile actions
  const login = (email: string) => {
    const existing = user || INITIAL_USER;
    const updated = {
      ...existing,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    setUser(updated);
    setIsLoggedIn(true);
    setStorageItem('savor_user', updated);
    showToast(`Welcome back, ${updated.name}!`, 'success');
    navigate('account');
  };

  const registerUser = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      addresses: [
        {
          id: 'addr-default',
          label: 'Home',
          street: '500 Howard St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
        },
      ],
      defaultAddressId: 'addr-default',
      savedCards: [
        {
          id: 'card-1',
          brand: 'Visa',
          last4: '4242',
          exp: '12/28',
        },
      ],
    };
    setUser(newUser);
    setIsLoggedIn(true);
    setStorageItem('savor_user', newUser);
    showToast(`Account created! Welcome to SAVOR, ${name}.`, 'success');
    navigate('account');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    showToast('You have been logged out.', 'info');
    navigate('home');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setStorageItem('savor_user', updated);
    showToast('Profile updated', 'success');
  };

  const addDeliveryAddress = (address: Omit<DeliveryAddress, 'id'>) => {
    if (!user) return;
    const id = `addr-${Date.now()}`;
    const newAddress: DeliveryAddress = { ...address, id };
    const updatedAddresses = [...user.addresses, newAddress];
    updateUserProfile({
      addresses: updatedAddresses,
      defaultAddressId: user.defaultAddressId || id,
    });
    showToast('Delivery address saved', 'success');
  };

  const deleteDeliveryAddress = (addressId: string) => {
    if (!user) return;
    const updated = user.addresses.filter((a) => a.id !== addressId);
    updateUserProfile({ addresses: updated });
    showToast('Address removed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        selectedProductId,
        trackedOrderId,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,

        activeModalProduct,
        setActiveModalProduct,

        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,

        deliveryType,
        setDeliveryType,
        promoCode,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        subtotal,
        deliveryFee,
        discount,
        tax,
        tipAmount,
        setTipAmount,
        total,

        orders,
        createOrder,
        updateOrderStatus,
        reorder,

        customers,

        user,
        isLoggedIn,
        login,
        registerUser,
        logout,
        updateUserProfile,
        addDeliveryAddress,
        deleteDeliveryAddress,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
