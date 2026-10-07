import axios from "axios";
import {
  DEMO_USERS,
  DEMO_APPLICATIONS,
  DEMO_CUSTOMERS,
  DEMO_CHARTS_DATA,
  DEMO_TASKS,
  DEMO_NOTIFICATIONS,
  DEMO_REFERRALS,
  DEMO_PROPERTIES,
} from "./demo-data";

export const API_URL = import.meta.env.VITE_API_URL || "/api";
export const IS_DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  typeof window !== "undefined" && window.location.hostname.includes("vercel.app");

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

function getStoredDemoUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ify_demo_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Handle demo / fallback mock data when the backend API is unavailable.
 */
function getDemoResponse(endpoint: string, method: string, payload?: any): any {
  const cleanEndpoint = endpoint.split("?")[0].replace(/^\/api(\/v1)?/, "");

  // Auth endpoints
  if (cleanEndpoint.startsWith("/auth/me")) {
    const user = getStoredDemoUser();
    return { user };
  }

  if (cleanEndpoint.startsWith("/auth/login")) {
    const loginId = payload?.loginId || payload?.email || "";
    let matchedUser = DEMO_USERS.super_admin;
    if (loginId.includes("assistant") || payload?.role === "assistant_admin") {
      matchedUser = DEMO_USERS.assistant_admin as any;
    } else if (loginId.includes("customer") || payload?.role === "customer") {
      matchedUser = DEMO_USERS.customer as any;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("ify_demo_user", JSON.stringify(matchedUser));
    }
    return { user: matchedUser, message: "Demo authentication successful" };
  }

  if (cleanEndpoint.startsWith("/auth/logout")) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ify_demo_user");
    }
    return { message: "Logged out successfully" };
  }

  if (cleanEndpoint.startsWith("/auth/google")) {
    const user = DEMO_USERS.customer;
    if (typeof window !== "undefined") {
      localStorage.setItem("ify_demo_user", JSON.stringify(user));
    }
    return { user };
  }

  // Applications
  if (cleanEndpoint.startsWith("/applications")) {
    return {
      success: true,
      applications: DEMO_APPLICATIONS,
      total: DEMO_APPLICATIONS.length,
    };
  }

  // Customers CRM
  if (cleanEndpoint.startsWith("/customers")) {
    // If asking for a specific customer detail
    const segments = cleanEndpoint.split("/");
    if (segments.length > 2 && segments[2]) {
      const custId = segments[2];
      const found = DEMO_CUSTOMERS.find((c) => c._id === custId) || DEMO_CUSTOMERS[0];
      return {
        customer: {
          ...found,
          applications: DEMO_APPLICATIONS.filter((a) => a.fullName === found.fullName),
          activities: [
            { message: "Aadhaar e-KYC verified via UIDAI OTP", timestamp: "2026-10-01T10:00:00Z" },
            { message: "CIBIL report pulled: Score 782", timestamp: "2026-10-02T11:30:00Z" },
            { message: "Property cadastral check completed", timestamp: "2026-10-05T14:20:00Z" },
          ],
        },
      };
    }

    return {
      success: true,
      customers: DEMO_CUSTOMERS,
      total: DEMO_CUSTOMERS.length,
      pages: 1,
    };
  }

  // Analytics & Dashboard charts
  if (cleanEndpoint.startsWith("/crm") || cleanEndpoint.startsWith("/analytics")) {
    return {
      success: true,
      ...DEMO_CHARTS_DATA,
    };
  }

  // Properties
  if (cleanEndpoint.startsWith("/properties")) {
    return {
      success: true,
      properties: DEMO_PROPERTIES,
      total: DEMO_PROPERTIES.length,
    };
  }

  // Tasks
  if (cleanEndpoint.startsWith("/tasks")) {
    return {
      success: true,
      tasks: DEMO_TASKS,
      total: DEMO_TASKS.length,
    };
  }

  // Notifications
  if (cleanEndpoint.startsWith("/notifications")) {
    return {
      success: true,
      notifications: DEMO_NOTIFICATIONS,
    };
  }

  // Referrals
  if (cleanEndpoint.startsWith("/referrals")) {
    return {
      success: true,
      referrals: DEMO_REFERRALS,
      total: DEMO_REFERRALS.length,
    };
  }

  // CIBIL check
  if (cleanEndpoint.startsWith("/cibil")) {
    return {
      success: true,
      score: 782,
      status: "Excellent",
      pan: payload?.pan || "ABCPS1234F",
      name: payload?.fullName || "Rajesh S. Sharma",
      factors: [
        { name: "On-time Payment History", status: "Excellent", value: "99.8%" },
        { name: "Credit Utilization", status: "Good", value: "18%" },
        { name: "Credit Age", status: "Good", value: "6.5 Years" },
        { name: "Total Accounts", status: "Healthy", value: "4 Active" },
      ],
    };
  }

  // Default empty/success object
  return { success: true, message: "Demo mock response" };
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const method = (options.method || "GET").toLowerCase();
  const headers = (options.headers as Record<string, string>) || {};
  let data: any = undefined;

  if (options.body) {
    try {
      data = JSON.parse(options.body as string);
    } catch {
      data = options.body;
    }
  }

  // If explicit demo mode is forced
  if (IS_DEMO_MODE && !endpoint.includes("/health")) {
    return getDemoResponse(endpoint, method, data);
  }

  try {
    const response = await api({
      url: endpoint,
      method,
      headers,
      data,
    });
    return response.data;
  } catch (error: any) {
    // Graceful fallback to mock data if network fails or endpoint returns 404/500/ECONNREFUSED
    if (!error.response || error.response.status === 404 || error.response.status >= 500) {
      console.warn(`[API Fallback] Endpoint "${endpoint}" unreachable. Serving high-fidelity demo mock.`);
      return getDemoResponse(endpoint, method, data);
    }

    if (error.response) {
      throw new Error(error.response.data?.message || `API request failed: ${error.response.statusText}`);
    }
    throw error;
  }
}
