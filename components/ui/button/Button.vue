<script setup lang="ts">
import { buttonVariants } from '.';
import { cn } from '@/lib/utils';

interface Props {
    variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant'];
    size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size'];
    as?: string;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    type: 'button',
});
</script>

<template>
    <component
        :is="as"
        :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
        :disabled="disabled || loading"
        :type="type"
    >
        <Icon v-if="props.loading" name="svg-spinners:90-ring-with-bg" />
        <slot />
    </component>
</template>
