<template>
    <main
        class="flex flex-col sm:flex-row max-w-screen-xl w-full h-full mx-auto"
    >
        <section class="grow flex flex-col w-full">
            <!-- Tambahkan padding responsif -->
            <slot></slot>
        </section>
    </main>
</template>
