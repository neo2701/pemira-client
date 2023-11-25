<template>
    <main
        class="max-w-screen-xl mx-auto md:grid md:grid-cols-[240px_minmax(0,1fr)]"
    >
        <Sidebar />
        <section>
            <ResponsiveSpace />
            <section>
                <slot></slot>
            </section>
        </section>
    </main>
</template>
