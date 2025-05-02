import api from "./api";

export const ocrApi = api.injectEndpoints({
    endpoints: (builder) => ({
        processReceipt: builder.mutation<{ success: boolean; results: string },{ image: string }>({
        query: (image) => ({
            url: '/ocrs/new',
            method: 'POST',
            body: image,
            headers: {
            'Content-Type': 'application/json',
            },
        }),
    }),
    }),

});

export const{
    useProcessReceiptMutation,
} = ocrApi;