import { AppConfig } from "@/AppConfig";
import axios from "axios";

export interface IMPLBotApiRequest {
    query: string
    user: string
    response_mode: "streaming" | "blocking"
    inputs: {}
    conversation_id?: string
    parent_message_id?: string
    files?: []
}

interface IMPLBotApiResponse {
    event: string;
    task_id: string;
    id: string;
    message_id: string;
    conversation_id: string;
    mode: string;
    answer: string;
    metadata: any;
    created_at: number;
}

const apiClient = axios.create({
    baseURL: AppConfig.MPL_BOT_API_REQUEST_URL,
    headers: {
        "Content-Type": "application/json",
        "authorization": "Basic bWRwOm1kcA==" // fixme: keep this in vault
    },
});

export const getMplBotResponse = async (
    query: string, 
    response_mode: "streaming" | "blocking",
    conversation_id?: string, 
    parent_message_id?: string
): Promise<IMPLBotApiResponse> => {
    const requestData: IMPLBotApiRequest = {
        query: query,
        user: "abc-123", // get the user from Azure Ad and pass it here
        response_mode: response_mode,
        inputs: {},
        conversation_id,
        parent_message_id,
        // files: [],
    };

    try {
        const res = await apiClient.post<IMPLBotApiResponse>("/mva/", requestData);
        return res.data;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error("Failed to fetch bot response.");
    }
};
