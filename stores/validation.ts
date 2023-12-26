export const useValidationStore = defineStore('validation', () => {
    const result = ref<ValidationResult[]>();

    return { result };
});
