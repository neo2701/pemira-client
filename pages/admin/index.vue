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
    <!-- Admin Color Palette -->
    <!-- Primary(Background): #454f63 -->
    <!-- Text: #647CA0  -->
    <div class="flex justify-between">
        <div class="mb-4">
            <h1 class="text-xl text-[#647CA0]">List Event</h1>
            <div class="text-sm">Event pemilihan yang telah dibuat</div>
        </div>
        <NuxtLink to="/admin/events/create">
            <UiButton class="text-white hover:bg-[#8494B4] bg-[#454f63]">
                Tambah Event <Icon name="fluent:add-12-regular" />
            </UiButton>
        </NuxtLink>
    </div>
    <EventList :events="events" @click="openEvent" />
</template>
