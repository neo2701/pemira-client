<script setup>
const { year } = usePemiraConfig();
</script>

<template>
    <aside
        class="md:sticky top-0 md:h-screen h-full border-r bg-secondary border-border"
    >
        <ResponsiveSpace />
        <div class="h-20 px-4 border-b border-dashed border-border">
            <h2 class="text-3xl text-primary whitespace-nowrap">
                PEMIRA {{ year }}
            </h2>
            <div class="text-sm font-semibold text-muted-foreground">
                E-Vote Himatifa
            </div>
        </div>
        <div class="p-4">
            <ul class="grid gap-2">
                <slot />
            </ul>
        </div>
    </aside>
</template>
