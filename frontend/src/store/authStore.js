import { create } from "zustand"
import axios from 'axios'

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api/auth" : "/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
    
    signup: async (name, email, password) => {
        set({isLoading: true, error: null})
        try {
            const response = await axios.post(`${API_URL}/signup`, { name, email, password });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
        }
    },
    
    login: async (email, password) => {
        set({isLoading: true, error: null})
        try {
            const res = await axios.post(`${API_URL}/login`, {email, password})
            set({isAuthenticated: true,
                user: res.data.user,
                error: null,
                isLoading: false,})
        } catch (error) {
            set({error: error.response?.data?.message || "Error loggin in", isLoading: false})
            throw error
        }
    },

    logout: async () => {
        set({isLoading: true, error: null})
        try {
            await axios.post(`${API_URL}/logout`)
            set({user: null, isAuthenticated: false, isLoading: false, error: null})
        } catch (error) {
            set({error: "Error logging out", isLoading: false})
            throw error
        }
    },
    
    verifyEmail: async (code) => {
        set({isLoading: true, error: null})
        try {
            const res = await axios.post(`${API_URL}/verify-email`, {code})
            set({isLoading: false, user: res.data.user, isAutenticated: true})
        } catch (error) {
            set({error: error.response.data.message || "Error Verifying your Email", isLoading: false})
            throw error
        }
    },


    checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/auth-check`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

	forgotPassword: async (email) => {
		set({isLoading: true, error: null})
		try {
			const res = await axios.post(`${API_URL}/forgot-password`, {email})
			set({user: res.data.user, isAuthenticated: false, isLoading: false})
		} catch (error) {
			set({error: error.response.data.message || "Error Sending Reset Password Link", isLoading: false})
            throw error
		}
	},

    resetPassword: async (token, password, retypePassword) => {
        set({isLoading: true, error: null})
        try {
            if (password !== "" && retypePassword !== "" && password === retypePassword){
                const res = await axios.post(`${API_URL}/reset-password/${token}`, {password})
                set({user: res.data.user, isAuthenticated: false, isLoading: false})
            }else{
                
                set({user: null, isAuthenticated: false, isLoading: false})
                throw new Error("Passwords mismatch")
            }
            
        } catch (error) {
            set({error: error.message || "Can't reset password", isLoading:false})
            throw error
        }
    }

    
}))
