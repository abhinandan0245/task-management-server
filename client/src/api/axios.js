import axios from "axios";

const baseURL = "http://localhost:10000";
export default axios.create({ baseURL });
