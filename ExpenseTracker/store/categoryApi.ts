import api from "./api";

export type Category = {
  _id: string;
  name: string;
  name_slug: string;
  user_id: string;
  is_deleted: boolean;
}

export type GetCategoryResponse = {
    data: Category;
}

export type GetCategoriesResponse = {
  data: Category[];
}

type CreateCategoryRequest = { name: string };
type UpdateCategoryRequest = { name: string };

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<GetCategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: `/categories/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["category"],
    }),

    updateCategory: builder.mutation<GetCategoryResponse, {id: string, body: UpdateCategoryRequest}>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    getUserCategories: builder.query<GetCategoriesResponse, void>({
        query: () => `/categories/all`,
        providesTags: ["category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetUserCategoriesQuery,
  useUpdateCategoryMutation
} = categoryApi;
