import axios, { AxiosInstance } from "axios";
import { IHttpClient } from "../interfaces/IHttpClient";

export class HttpClient implements IHttpClient {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create();
	}
	async post<T>(url: string, data: any, config?: any): Promise<T> {
		const response = await this.axiosInstance.post<T>(url, data, config);
		return response.data;
	}
	async get<T>(url: string, config?: any): Promise<T> {
		const response = await this.axiosInstance.get<T>(url, config);
		return response.data;
	}

}
