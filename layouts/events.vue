<script lang="ts" setup>
const route = useRoute();
const eventStore = useEventStore();

const isValidation = computed(() => {
    return (
        route.name === 'admin-events-event-validation' ||
        route.name === 'admin-events-event-result'
    );
});
</script>

<template>
    <main v-if="isValidation" class="h-[100dvh] flex flex-col">
        <slot></slot>
    </main>
    <main
        v-else
        class="max-w-screen-xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
        <Sidebar>
            <template v-if="eventStore.event?.id">
                <template v-if="isValidation">
                    <SidebarMenu
                        :to="`/admin/events/${eventStore.event?.id}/validation`"
                    >
                        <Icon
                            name="fluent:checkmark-circle-16-regular"
                            size="20"
                        />
                        <span>Validasi Suara</span>
                    </SidebarMenu>
                    <SidebarMenu
                        :to="`/admin/events/${eventStore.event?.id}/dashboard`"
                    >
                        <Icon name="fluent:arrow-left-16-regular" size="20" />
                        <span>Kembali</span>
                    </SidebarMenu>
                </template>
                <template v-else>
                    <SidebarMenu
                        :to="`/admin/events/${eventStore.event?.id}/dashboard`"
                    >
                        <Icon name="fluent:home-16-regular" size="20" />
                        <span>Dashboard</span>
                    </SidebarMenu>
                    <SidebarMenu
                        :to="`/admin/events/${eventStore.event?.id}/divisions`"
                    >
                        <Icon name="fluent:people-16-regular" size="20" />
                        <span>Kandidat</span>
                    </SidebarMenu>
                    <SidebarMenu
                        :to="`/admin/events/${eventStore.event?.id}/whitelists`"
                    >
                        <Icon
                            name="fluent:checkbox-person-16-regular"
                            size="20"
                        />
                        <span>Whitelist</span>
                    </SidebarMenu>
                    <SidebarMenu
                        :to="`/admin/events/${eventStore.event?.id}/organizers`"
                    >
                        <Icon
                            name="fluent:briefcase-person-24-regular"
                            size="20"
                        />
                        <span>Panitia</span>
                    </SidebarMenu>
                    <SidebarMenu :to="`/admin/login`">
                        <Icon name="fluent:sign-out-24-regular" size="20" />
                        <span>Keluar</span>
                    </SidebarMenu>
                </template>
            </template>
        </Sidebar>
        <section>
            <ResponsiveSpace />
            <div class="px-4 h-20 border-b border-dashed">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold">
                            {{ eventStore.event?.title }}
                        </div>
                        <div class="text-muted-foreground text-sm">
                            {{ eventStore.event?.description }}
                        </div>
                    </div>
                    <div>
                        Status:
                        <span
                            v-if="eventStore.status === 0"
                            class="text-red-600 font-medium"
                        >
                            Belum dimulai
                        </span>
                        <span
                            v-else-if="eventStore.status === 1"
                            class="text-yellow-600 font-medium"
                        >
                            Sedang berlangsung
                        </span>
                        <span
                            v-else-if="eventStore.status === 2"
                            class="text-green-600 font-meidum"
                        >
                            Selesai
                        </span>
                    </div>
                </div>
            </div>
            <section class="p-6">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
