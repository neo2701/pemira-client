<script lang="ts" setup>
const route = useRoute();
const eventStore = useEventStore();

const isValidation = computed(() => {
    return (
        route.name === 'admin-events-event-validation' ||
        route.name === 'admin-events-event-result' ||
        route.name === 'admin-events-event-result-overall' ||
        route.name === 'admin-events-event-result-overview'
    );
});

const showSidebar = ref(false);
const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};
</script>

<template>
    <main v-if="isValidation" class="h-[100dvh] flex flex-col">
        <slot></slot>
    </main>
    <main
        v-else
        class="md:max-w-screen-xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
        <div
            v-if="showSidebar"
            @click="toggleSidebar"
            class="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        ></div>

        <Sidebar
            :class="{
                'fixed inset-y-0 left-0 z-50 transform transition-transform md:relative md:translate-x-0  shadow-lg md:shadow-none': true,
                '-translate-x-full': !showSidebar,
                'translate-x-0 w-64 p-4': showSidebar,
            }"
        >
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
                    <SidebarMenu :to="`/admin/login`">
                        <Icon name="fluent:sign-out-24-regular" size="20" />
                        <span>Keluar</span>
                    </SidebarMenu>
                </template>
            </template>
        </Sidebar>
        <section>
            <ResponsiveSpace />
            <div class="px-4 h-20 border-b border-dashed border-[#4a5e87]">
                <div class="flex md:block">
                    <button
                        @click="toggleSidebar"
                        class="md:hidden p-2 text-white bg-transparent mr-2"
                    >
                        <Icon name="ri:menu-2-fill" size="24" />
                    </button>

                    <div
                        class="flex items-center justify-between md:gap-0 gap-[2rem]"
                    >
                        <div>
                            <div class="text-lg font-bold">
                                {{ eventStore.event?.title }}
                            </div>
                            <div
                                class="text-muted-foreground text-sm md:whitespace-normal whitespace-nowrap"
                            >
                                {{ eventStore.event?.description }}
                            </div>
                        </div>
                        <div>
                            Status:
                            <span
                                v-if="eventStore.status === false"
                                class="text-red-600 font-medium"
                            >
                                Belum dimulai
                            </span>
                            <span
                                v-else-if="eventStore.status === true"
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
            </div>
            <section class="p-6">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
