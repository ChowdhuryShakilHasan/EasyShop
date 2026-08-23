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

interface UpdateOrderStatusRequest {
  id: string;
  orderStatus: Order["orderStatus"];
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

    updateProduct: builder.mutation<Product, Product>({
      query: (product) => ({
        url: `/products/${product.id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation<Order, UpdateOrderStatusRequest>({
      async queryFn(arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery(`/orders/${arg.id}`);
        if (result.error) return { error: result.error };

        const order = result.data as Order;
        const patched = await baseQuery({
          url: `/orders/${arg.id}`,
          method: "PUT",
          body: { ...order, orderStatus: arg.orderStatus },
        });

        if (patched.error) return { error: patched.error };
        return { data: patched.data as Order };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetCustomersQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = apiSlice;