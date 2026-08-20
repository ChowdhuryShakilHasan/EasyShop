import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, Order, Customer } from "../../types";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
}

interface LoginRequest {
  email: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  tagTypes: ["Product", "Order", "Customer"],
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginRequest>({
      async queryFn({ email, password }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery(
          `/users?email=${email}&password=${password}`
        );

        if (result.error) {
          return { error: result.error };
        }

        const users = result.data as (User & { password: string })[];

        if (users.length === 0) {
          return {
            error: { status: 401, data: "Invalid email or password" },
          };
        }

        const { id, email: userEmail, name, role } = users[0];
        return { data: { id, email: userEmail, name, role } };
      },
    }),

    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Order"],
    }),

    getCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
      providesTags: ["Customer"],
    }),

    addProduct: builder.mutation<Product, Omit<Product, "id">>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: { ...newProduct, id: Date.now().toString() },
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetCustomersQuery,
  useAddProductMutation,
} = apiSlice;