<script lang="ts" setup>
defineProps<{
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
}>();

defineEmits<{
    (e: 'confirm'): void;
}>();
</script>

<template>
    <UiAlertDialog>
        <UiAlertDialogTrigger>
            <slot></slot>
        </UiAlertDialogTrigger>
        <UiAlertDialogContent>
            <UiAlertDialogHeader >
                <UiAlertDialogTitle  class="text-center">
                    {{ $props.title }}
                </UiAlertDialogTitle>
                <UiAlertDialogDescription class="whitespace-pre-line text-start h-56 overflow-y-scroll border p-2">
                    {{ $props.description }}
                </UiAlertDialogDescription>
            </UiAlertDialogHeader>
            <UiAlertDialogFooter class="flex-col-reverse">
                <UiAlertDialogCancel class="h-10">
                    {{ $props.cancelText ?? 'Cancel' }}
                </UiAlertDialogCancel>
                <UiCardDescription class="md:[display:none] text-center"
                    >Atau</UiCardDescription
                >
                <UiAlertDialogAction class="h-10" @click="$emit('confirm')">
                    {{ $props.confirmText ?? 'Continue' }}
                </UiAlertDialogAction>
            </UiAlertDialogFooter>
        </UiAlertDialogContent>
    </UiAlertDialog>
</template>
