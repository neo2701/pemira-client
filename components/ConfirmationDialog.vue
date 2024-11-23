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
