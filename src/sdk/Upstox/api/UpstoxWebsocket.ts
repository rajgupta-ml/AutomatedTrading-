import WebSocket from "ws";
import { UpstoxUnknownError } from "../errors/UpstoxUnknownError";
import { IHttpClient } from "../interfaces/IHttpClient";
import { getMarketFeedUrl } from "../urls";
import { IGetMarketUriResponse, IUpstoxWebsocket } from "../interfaces/IUpstox";

export class UpstoxWebsocket implements IUpstoxWebsocket {
	private client: IHttpClient;
	constructor(client: IHttpClient) {
		this.client = client
	}
	async getMarketFeedURI(access_token: string): Promise<IGetMarketUriResponse> {

		return new Promise(async (resolve, reject) => {
			const config = {
				headers: {
					'accept': 'application/json',
					"Authorization": `Bearer ${access_token}`
				}
			}


			const response: IGetMarketUriResponse = await this.client.get(getMarketFeedUrl, config);
			if (response.status) resolve(response);
			reject(new UpstoxUnknownError("Internal Server Error", "getMarketFeedUri Error"))
		})


	}


	async connectToUpstoxWithWs(wsURL: string, access_token: string): Promise<WebSocket> {
		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Api-Version": "v2",
					Authorization: "Bearer " + access_token,
				},
				followRedirects: true,
			};


			const data = {
				guid: "someguid",
				method: "sub",
				data: {
					mode: "full",
					instrumentKeys: "*",
				},
			}

			const ws = new WebSocket(wsURL, config);
			ws.on("open", () => {
				console.log("Websocket is connected to the UpstoxServer");
				setTimeout(() => {
					ws.send(Buffer.from(JSON.stringify(data)));
				})

				resolve(ws);
			})


			ws.on("error", (error) => {
				reject(new UpstoxUnknownError("Websocket connection error", "ConnectToUpstoxWithWs Error", error.toString() as string));
			})
		})
	}
}
