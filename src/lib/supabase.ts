import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing, avoid crashing dev server. Use a minimal mock client instead.
let client: any;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing Supabase environment variables. Using mock client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
  );

  const mock = {
    from() {
      return {
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
            single: () => Promise.resolve({ data: null, error: null }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: async () => ({ error: null }),
      };
    },
  };

  client = mock;
} else {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;

// Types used in App.tsx
export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  features: string[];
  benefits: string[];
  specifications: Record<string, string>;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
};
