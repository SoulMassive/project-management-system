import { apiSlice } from '../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Password-based ─────────────────────────────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // ── OTP-based ──────────────────────────────────────────────────────────
    /** Step 1: request an OTP to be emailed */
    sendOtp: builder.mutation({
      query: (body: { email: string; purpose: 'login' | 'register' }) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),
    /** Step 2a: verify OTP for login */
    loginOtp: builder.mutation({
      query: (body: { email: string; otp: string }) => ({
        url: '/auth/login-otp',
        method: 'POST',
        body,
      }),
    }),
    /** Step 2b: verify OTP + submit registration form */
    registerOtp: builder.mutation({
      query: (body: {
        name: string;
        email: string;
        password: string;
        otp: string;
        company?: string;
      }) => ({
        url: '/auth/register-otp',
        method: 'POST',
        body,
      }),
    }),

    // ── Misc ───────────────────────────────────────────────────────────────
    getMe: builder.query({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useLoginOtpMutation,
  useRegisterOtpMutation,
  useGetMeQuery,
} = authApiSlice;
