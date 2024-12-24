import axios from "axios"

const Api = axios.create({ baseURL: "http://localhost:5000/api" });

Api.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token) req.headers.Authorization = token;
    return req;
});

export const login = (data) => Api.post("/auth/login", data);
export const register = (data) => Api.post("/auth/register", data);
export const getTransactions = () => Api.get("/transactions");
export const addTransaction = (transactionData) => Api.post("/transactions", transactionData);
export const getDashboardData = () => Api.get("/dashboard");
export const getGoals = () => Api.get("/goals");
export const createGoal = (goalData) => Api.post("/goals", goalData);
export const updateGoal = (id, updateData) => Api.put(`/goals/${id}`, updateData);