export type Category = 'all' | 'burgers' | 'pizzas' | 'bowls' | 'sushi' | 'sides' | 'drinks' | 'desserts';

export type DietaryTag = 'chef-special' | 'vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'organic';

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  required?: boolean;
  maxSelections?: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  dietaryTags: DietaryTag[];
  image: string;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  calories: number;
  inStock: boolean;
  featured?: boolean;
  optionGroups?: OptionGroup[];
}

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  unitPrice: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
  selectedOptions: SelectedOption[];
}

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface DeliveryAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  street: string;
  aptSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  address?: DeliveryAddress;
  estimatedDeliveryTime: string;
  paymentMethod: 'card' | 'apple_pay' | 'cash';
  paymentLast4?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    avatar: string;
    currentLocationLat?: number;
    currentLocationLng?: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: DeliveryAddress[];
  defaultAddressId?: string;
  savedCards: {
    id: string;
    brand: string;
    last4: string;
    exp: string;
  }[];
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'vip' | 'new';
}
