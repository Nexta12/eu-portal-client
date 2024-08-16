import useSWR, { mutate } from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { SuccessResponse } from '@customTypes/general';
import { Livechat } from '@customTypes/livechat';

const useChatMessages = (chatId: string | null) => {
    const { data, error } = useSWR(
        chatId ? `${endpoints.getAllChats}/${chatId}` : null,
        async (url: string) => {
            const response = await apiClient.get<SuccessResponse<Livechat[]>>(url);
            return response.data.data;
        }
    );

    return {
        chatMessages: data,
        isLoading: !error && !data,
        isError: error,
        mutate: () => {
            if (chatId) {
                mutate(`${endpoints.getAllChats}/${chatId}`);
            }
        }
    };
};

export default useChatMessages;
