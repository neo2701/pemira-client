<script lang="ts" setup>
const eventStore = useEventStore();
</script>

<template>
    <main
        class="max-w-screen-xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
        <Sidebar>
            <template v-if="eventStore.event?.id">
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
                    <Icon name="fluent:checkbox-person-16-regular" size="20" />
                    <span>Whitelist</span>
                </SidebarMenu>
                <SidebarMenu
                    :to="`/admin/events/${eventStore.event?.id}/organizers`"
                >
                    <Icon name="fluent:briefcase-person-24-regular" size="20" />
                    <span>Panitia</span>
                </SidebarMenu>
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
                        <span class="text-red-500 font-medium"
                            >Belum dimulai</span
                        >
                    </div>
                </div>
            </div>
            <section class="p-6">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
