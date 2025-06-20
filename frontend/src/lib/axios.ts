import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

let isRefreshing = false;
let requestQueue: ((token: string) => void)[] = [];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem("refresh_token")
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    requestQueue.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const res = await axios.post("http://localhost:8000/api-auth/token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = res.data.access;
                localStorage.setItem("token", newAccessToken);

                if (res.data.refresh) {
                    localStorage.setItem("refresh_token", res.data.refresh);  // ← ここで更新！
                }

                requestQueue.forEach((cb) => cb(newAccessToken));
                requestQueue = [];
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                requestQueue = [];
                isRefreshing = false;

                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";

                return Promise.reject(refreshError);  // 👈 ここが reject の意味
            }
        }

        return Promise.reject(error);  // 👈 リフレッシュ対象外エラー（普通の失敗）
    }
);

export default api;
