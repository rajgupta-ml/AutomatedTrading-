export interface IHttpClient {
	post<T>(url: string, data: any, config?: any): Promise<T>;
	get<T>(url: string, config?: any): Promise<T>;
	// Add other methods as needed
}

