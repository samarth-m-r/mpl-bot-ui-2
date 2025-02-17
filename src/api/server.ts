import { AppConfig } from "@/AppConfig";
import axios from "axios";

interface IMPLBotApiRequest {
    query: string;
    user: string;
    response_mode: "streaming" | "blocking";
    inputs: {};
    conversation_id?: string;
    parent_message_id?: string;
    files?: [];
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
    },
});

export const getMplBotResponse = async (
    query: string,
    conversation_id?: string,
    parent_message_id?: string
): Promise<IMPLBotApiResponse> => {
    const requestData: IMPLBotApiRequest = {
        query,
        user: "abc-123", // Replace with actual user ID from authentication
        response_mode: "blocking",
        inputs: {},
        conversation_id,
        parent_message_id,
        files: [],
    };

    try {
        const res = await apiClient.post<IMPLBotApiResponse>("/ask_bot", requestData);
        return res.data;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error("Failed to fetch bot response.");
    }
};
