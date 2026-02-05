import axios from "axios"
import { Platform } from "react-native"
import { getToken } from "./authStorage"

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000"      // Android emulator
    : Platform.OS === "ios"
    ? "http://localhost:4000"     // iOS simulator
    : "http://localhost:4000"     // Web

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
})

api.interceptors.request.use(
  async (config) => {
    const token = await getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)
