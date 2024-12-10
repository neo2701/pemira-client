<template>
    <main
        class="max-w-screen-2xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)] text-[#647CA0]"
    >
        <Sidebar />
        <section class="bg-[#242e42]">
            <ResponsiveSpace class="md:block hidden" />
            <div
                class="px-4 h-20 border-b border-dashed border-[#4a5e87] hidden md:block"
            ></div>
            <section class="p-6 bg-[#242e42]">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
