<script lang="ts" setup>
const events = ref<Event[]>([]);

const getEvents = async () => {
    const { data } = await useApiFetch('/events');
    events.value = data.value ?? [];
};

const openEvent = (event: Event) => navigateTo('/admin/events/' + event.id);

onMounted(getEvents);
</script>

<template>
    <div class="flex justify-between">
        <div class="mb-4">
            <h1 class="text-xl text-primary">List Event</h1>
            <div class="text-sm text-muted-foreground">
                Event pemilihan yang telah dibuat
            </div>
        </div>
        <NuxtLink to="/admin/events/create">
            <UiButton
                class="hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
            >
                Tambah Event <Icon name="fluent:add-12-regular" />
            </UiButton>
        </NuxtLink>
    </div>
    <EventList :events="events" @click="openEvent" />
</template>
