<template>
    <main
        class="max-w-screen-2xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)] text-foreground"
    >
        <Sidebar />
        <section class="bg-background">
            <ResponsiveSpace class="md:block hidden" />
            <div
                class="px-4 h-20 border-b border-dashed border-border hidden md:block"
            ></div>
            <section class="p-6 bg-background">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
