<template>
    <main
        class="max-w-screen-xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
        <Sidebar />
        <section>
            <ResponsiveSpace />
            <div class="px-4 h-20 border-b border-dashed"></div>
            <section class="p-6">
                <slot></slot>
            </section>
        </section>
    </main>
</template>
