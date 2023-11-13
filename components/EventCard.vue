<template>
    <UiCard
        class="relative cursor-pointer transition select-none overflow-hidden group hover:ring-2 hover:ring-black active:scale-95"
    >
        <UiCardHeader
            class="w-full h-full absolute flex items-center justify-center bg-black bg-opacity-0 transition group-hover:bg-opacity-50"
        >
            <UiButton class="opacity-0 transition group-hover:opacity-100">
                Buka
            </UiButton>
        </UiCardHeader>
        <UiCardHeader class="flex items-center border-b">
            <img src="/himatifa.jpg" alt="HIMATIFA" class="w-1/2" />
        </UiCardHeader>
        <UiCardHeader>
            <UiCardTitle>PEMIRA IF 2024</UiCardTitle>
            <UiCardDescription>
                Pemilihan BLJ dan Ketua Wakil HIMATIFA
            </UiCardDescription>
        </UiCardHeader>
    </UiCard>
</template>
