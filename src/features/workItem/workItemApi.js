import { baseApi } from "../../services/baseApi";

export const workItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 取得 WorkItem 列表，接受排序與分頁參數
    getWorkItems: builder.query({
      query: ({ sort = "latest", page = 1, pageSize = 10 }) =>
        `/work-items?sort=${sort}&page=${page}&pageSize=${pageSize}`,
      // 使用 providesTags 提供快取標籤，注意現在回傳的是分頁物件 { items, ... }
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map(({ id, Id, workItemId }) => ({
                type: "WorkItem",
                id: id || Id || workItemId,
              })),
              { type: "WorkItem", id: "LIST" },
            ]
          : [{ type: "WorkItem", id: "LIST" }],
    }),

    // 取得單一 WorkItem (若日後需要詳細頁面)
    getWorkItem: builder.query({
      query: (id) => `/work-items/${id}`,
      providesTags: (result, error, id) => [{ type: "WorkItem", id }],
    }),

    // 批次確認 (POST)
    batchConfirm: builder.mutation({
      query: (ids) => ({
        url: "/work-items/batch-confirm",
        method: "POST",
        // 將陣列包裝成物件，以符合後端 BatchConfirmRequest DTO
        // 如果後端的屬性名稱是別的 (例如 "ids")，請調整此處的 key
        body: { workItemIds: ids },
      }),
      // 執行成功後，失效 'LIST' 標籤與特定項目標籤，讓 getWorkItems 與 getWorkItem 自動重新 Fetch
      invalidatesTags: (result, error, ids) => [
        { type: "WorkItem", id: "LIST" },
        ...(ids || []).map((id) => ({ type: "WorkItem", id })),
      ],
    }),

    // 撤銷單一項目 (POST)
    revokeWorkItem: builder.mutation({
      query: (id) => ({
        url: `/work-items/${id}/revoke`,
        method: "POST",
      }),
      // 撤銷成功後，可以讓該 ID 的資料或整個列表重新 Fetch
      invalidatesTags: (result, error, id) => [
        { type: "WorkItem", id: "LIST" },
        { type: "WorkItem", id },
      ],
    }),

    // --- Admin Endpoints ---

    // 取得 Admin WorkItem 列表，接受排序與分頁參數
    getAdminWorkItems: builder.query({
      query: ({ sort = "latest", page = 1, pageSize = 10 }) =>
        `/admin/work-items?sort=${sort}&page=${page}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map(({ id, Id, workItemId }) => ({
                type: "WorkItem",
                id: id || Id || workItemId,
              })),
              { type: "WorkItem", id: "LIST" },
            ]
          : [{ type: "WorkItem", id: "LIST" }],
    }),

    // 取得單一 Admin WorkItem
    getAdminWorkItem: builder.query({
      query: (id) => `/admin/work-items/${id}`,
      providesTags: (result, error, id) => [{ type: "WorkItem", id }],
    }),

    // 新增 WorkItem
    createWorkItem: builder.mutation({
      query: (data) => ({
        url: "/admin/work-items",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "WorkItem", id: "LIST" }],
    }),

    // 修改 WorkItem
    updateWorkItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/work-items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "WorkItem", id: "LIST" },
        { type: "WorkItem", id },
      ],
    }),

    // 刪除 WorkItem
    deleteWorkItem: builder.mutation({
      query: (id) => ({
        url: `/admin/work-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "WorkItem", id: "LIST" },
        { type: "WorkItem", id },
      ],
    }),
  }),
});

export const {
  useGetWorkItemsQuery,
  useGetWorkItemQuery,
  useBatchConfirmMutation,
  useRevokeWorkItemMutation,
  useGetAdminWorkItemsQuery,
  useGetAdminWorkItemQuery,
  useCreateWorkItemMutation,
  useUpdateWorkItemMutation,
  useDeleteWorkItemMutation,
} = workItemApi;
