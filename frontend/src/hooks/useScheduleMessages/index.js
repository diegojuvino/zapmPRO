import api from "../../services/api";

const useScheduleMessages = () => {

    const save = async (data) => {
        const { data: responseData } = await api.request({
            url: '/schedule-messages',
            method: 'POST',
            data
        });
        return responseData;
    }

    const update = async (data) => {
        const { data: responseData } = await api.request({
            url: `/schedule-messages/${data.id}`,
            method: 'PUT',
            data
        });
        return responseData;
    }

    const deleteRecord = async (id) => {
        const { data } = await api.request({
            url: `/schedule-messages/${id}`,
            method: 'DELETE'
        });
        return data;
    }

    const list = async (params) => {
        const { data } = await api.request({
            url: '/schedule-messages/list',
            method: 'GET',
            params
        });
        return data;
    }

    return {
        save,
        update,
        deleteRecord,
        list
    }
}

export default useScheduleMessages;