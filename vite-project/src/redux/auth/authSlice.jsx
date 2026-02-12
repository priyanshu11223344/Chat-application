import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  resendPassOtp,
  verifyPassOtp,
  resetPassword,
  getAllUsers,logoutUser,checkAuth
} from "./authThunk";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    message: null,
    error: null,
    isAuthenticated: false,
    otpVerified: false,
    passwordReset: false,
    users: [],
    user:null,

    errors: {
      register: null,
      login: null,
      otp: null,
      resendOtp: null,
      resendPassOtp: null,
      resetPassword: null,
    }
  },

  reducers: {
    clearState: (state) => {
      state.error = null;
      state.message = null;
    }
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- REGISTER ---------------- */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errors.register = action.payload;
      })

      /* ---------------- LOGIN ---------------- */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.errors.login = action.payload;
      })

      /* ---------------- VERIFY OTP ---------------- */
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.otpVerified = false;
        state.errors.otp = action.payload;
      })

      /* ---------------- RESEND OTP ---------------- */
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.errors.resendOtp = action.payload;
      })

      /* ---------------- RESET PASSWORD OTP ---------------- */
      .addCase(resendPassOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendPassOtp.rejected, (state, action) => {
        state.loading = false;
        state.errors.resendPassOtp = action.payload;
      })

      /* ---------------- FINAL PASSWORD RESET ---------------- */
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordReset = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordReset = false;
        state.errors.resetPassword = action.payload;
      })

      /* ---------------- GET ALL USERS ---------------- */
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGOUT LOGIC
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // CHECK AUTH LOGIC 
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      
      /* ---------------- GENERIC PENDING ---------------- */
      .addMatcher(
        (action) =>
  action.type.endsWith("/pending") &&
  !action.type.startsWith("auth/check"),

        (state) => {
          state.loading = true;
          state.error = null;
          state.errors = {
            register: null,
            login: null,
            otp: null,
            resendOtp: null,
            resendPassOtp: null,
            resetPassword: null,
          };
        }
      );
  }
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;
