import axios from "axios"

const Api = axios.create({ baseURL: "https://personal-finance-tracker-jiz7.onrender.com/api" });

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
export const getSpendingTrends = () => Api.get("/spending-trends");
export const getCategoryInsights = () => Api.get("/category-insights");
export const getPredictedExpenses = () => Api.get("/predict-expenses");
export const ExportButtons = () => Api.get("/export/csv");