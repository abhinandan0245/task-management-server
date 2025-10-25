import axios from "axios";

// const baseURL = "http://localhost:10000";
const baseURL = import.meta.env.VITE_API_BASE_URL;
export default axios.create({ baseURL });
