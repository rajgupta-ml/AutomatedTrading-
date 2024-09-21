import axios from "axios";
import { IMicroServiceCaller } from "../interfaces/IMicroServiceCaller.interface";
import { Response } from "../success/Response.success";

export class MicroServiceCaller implements IMicroServiceCaller {

    async startDataDigestion(access_token: string): Promise<Response> {
        const result = await axios.post("http://localhost:8081/api/v1/dataIngestion", { access_token });
        if (result.status === 200) return new Response(200, "DataDigestion", "Succesfully started Data Digestion", result.data)
        return new Response(result.status, "Data Digestion", "Unsuccesfull starting data Digestion", result.data);
    }
}
