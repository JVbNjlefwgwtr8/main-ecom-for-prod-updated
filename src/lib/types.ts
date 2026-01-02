export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  banner_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  store_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  store_id: string;
  created_at: string;
}

export interface DiscountBanner {
  id: string;
  text: string;
  is_active: boolean;
  background_color: string;
  text_color: string;
  store_id: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  display_text: string;
  url: string;
  store_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}
