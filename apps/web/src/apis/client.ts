import axios from "axios";

const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

// TODO: Axios interceptors
client.interceptors.request.use((config) => {
	return config;
});

client.interceptors.response.use((response) => {
	return response;
});

export default client;
