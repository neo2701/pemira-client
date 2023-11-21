<script lang="ts" setup>
const user = useAuth().user();
</script>

<template>
    <main
        class="max-w-screen-xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
        <SideBar />
        <section>
            <ResponsiveSpace />
            <div class="px-4 h-20 border-b border-dashed">
                <div class="flex items-center justify-end gap-2">
                    <h1>{{ user?.name }}</h1>
                    <UiAvatar>
                        <UiAvatarImage src="https://i.pravatar.cc/300" />
                    </UiAvatar>
                </div>
            </div>
            <section class="p-6">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
