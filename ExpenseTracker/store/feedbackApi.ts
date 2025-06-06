import api from "./api";

export const feedbackApi = api.injectEndpoints({
    endpoints: (builder) => ({
      registerFeedback: builder.mutation({
        query: (body) => ({
          url: `/feedbacks/new`,
          method: "POST",
          body,
        }),
      }),
    }),
  });
  
  export const {
    useRegisterFeedbackMutation
  } = feedbackApi;