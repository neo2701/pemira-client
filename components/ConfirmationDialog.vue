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
            <UiAlertDialogHeader>
                <UiAlertDialogTitle>
                    {{ $props.title }}
                </UiAlertDialogTitle>
                <UiAlertDialogDescription>
                    {{ $props.description }}
                </UiAlertDialogDescription>
            </UiAlertDialogHeader>
            <UiAlertDialogFooter>
                <UiAlertDialogCancel>
                    {{ $props.cancelText ?? 'Cancel' }}
                </UiAlertDialogCancel>
                <UiAlertDialogAction @click="$emit('confirm')">
                    {{ $props.confirmText ?? 'Continue' }}
                </UiAlertDialogAction>
            </UiAlertDialogFooter>
        </UiAlertDialogContent>
    </UiAlertDialog>
</template>
