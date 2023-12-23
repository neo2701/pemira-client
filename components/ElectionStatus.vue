<template>
    <div class="grid grid-cols-3 gap-4">
        <LatestBallotsCard class="col-span-2" />
        <div>
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between">
                        Total Surat Suara
                        <Icon
                            name="fluent:people-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                    <UiCardDescription class="text-2xl">0</UiCardDescription>
                </UiCardHeader>
            </UiCard>
        </div>
    </div>
</template>
