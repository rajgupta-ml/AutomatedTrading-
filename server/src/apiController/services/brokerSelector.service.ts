import { UpstoxServices } from "../../sdk/Upstox/core/UpstoxService";

export class BrokerSelector {

    // Method to get the broker service instance
    getBroker(brokerName: string) {
        const brokerNameLower = brokerName.toLowerCase();

        // Use a Map or a similar structure for scalability
       if(brokerNameLower === "upstox"){
            return new UpstoxServices();
       }else{
            throw new Error("This service is not available")
       }
    }
}
