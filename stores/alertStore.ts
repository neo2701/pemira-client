import { defineStore } from 'pinia';

type AlertType = 'success' | 'error' | 'warning' | 'info';
type Alert = {
    text: string;
    type: AlertType;
};

export const useAlertStore = defineStore('alert', () => {
    const data = ref<Alert>({} as Alert);
    const active = computed(() => !!data.value.text && !!data.value.type);

    const show = (text: string, type: AlertType) => {
        data.value.text = text;
        data.value.type = type;
    };

    const clear = () => {
        data.value = {} as Alert;
    };

    return { data, active, show, clear };
});
