<template>
    <aside
        class="md:sticky top-0 md:h-screen h-full border-r bg-[#242e42] border-[#4a5e87]"
    >
        <ResponsiveSpace />
        <div class="h-20 px-4 border-b border-dashed border-[#4a5e87]">
            <h2 class="text-3xl text-[#647CA0]">PEMIRA 2025</h2>
            <div class="text-sm font-semibold text-[#B0B8C3]">
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
