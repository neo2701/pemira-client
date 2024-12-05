<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
}>();

defineEmits<{
    (e: 'confirm'): void;
}>();

const isChecked = ref(false);
</script>

<template>
    <UiAlertDialog>
        <UiAlertDialogTrigger>
            <slot></slot>
        </UiAlertDialogTrigger>
        <UiAlertDialogContent>
            <UiAlertDialogHeader>
                <UiAlertDialogTitle class="text-center">
                    {{ $props.title }}
                </UiAlertDialogTitle>
                <UiAlertDialogDescription class="whitespace-pre-line text-start h-56 overflow-y-scroll border p-2 text-white">
                    {{ $props.description }}
                </UiAlertDialogDescription>
                <div class="flex items-center justify-start mb-4">
                    <input 
                        type="checkbox" 
                        id="confirm-checkbox" 
                        v-model="isChecked"
                        class="mr-2 rounded text-green-600 focus:ring-green-500" 
                    />
                    <label for="confirm-checkbox" class="text-sm text-primary">
                        Saya setuju dengan syarat dan ketentuan
                    </label>
                </div>
            </UiAlertDialogHeader>
            <UiAlertDialogFooter class="flex-col-reverse">
                
                <UiAlertDialogCancel class="h-10">
                    {{ $props.cancelText ?? 'Cancel' }}
                </UiAlertDialogCancel>
                <UiCardDescription class="md:[display:none] text-center">
                    Atau
                </UiCardDescription>
                <UiAlertDialogAction
                    class="h-10 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    :disabled="!isChecked"
                    @click="$emit('confirm')"
                >
                    {{ $props.confirmText ?? 'Continue' }}
                </UiAlertDialogAction>
            </UiAlertDialogFooter>
        </UiAlertDialogContent>
    </UiAlertDialog>
</template>
