<template>
    <NuxtLayout name="admin">
        <div class="flex justify-between">
            <div class="mb-4">
                <h1 class="text-xl">List Event</h1>
                <div class="text-sm">Event pemilihan yang telah dibuat</div>
            </div>
            <NuxtLink to="create">
                <UiButton>
                    Tambah Event <i name="fluent:add-12-filled"></i>
                </UiButton>
            </NuxtLink>
        </div>
        <EventList />
    </NuxtLayout>
</template>
