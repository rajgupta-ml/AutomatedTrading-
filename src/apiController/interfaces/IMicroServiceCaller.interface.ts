import { Response } from "../success/Response.success";

export interface IMicroServiceCaller {
    startDataDigestion(access_token: string): Promise<Response>
}
