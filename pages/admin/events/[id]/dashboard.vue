<template>
    <h2 class="text-xl font-bold mb-4">Dashboard</h2>
    <div class="grid gap-6">
        <div class="grid grid-cols-3 gap-4">
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between">
                        Total Kandidat
                        <Icon
                            name="fluent:people-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                </UiCardHeader>
                <UiCardContent>
                    <UiCardDescription>0</UiCardDescription>
                </UiCardContent>
            </UiCard>
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between">
                        Total Whitelist
                        <Icon
                            name="fluent:checkbox-person-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                </UiCardHeader>
                <UiCardContent>
                    <UiCardDescription>0</UiCardDescription>
                </UiCardContent>
            </UiCard>
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle class="flex justify-between">
                        Total Panitia
                        <Icon
                            name="fluent:checkbox-person-16-regular"
                            class="text-muted-foreground"
                        />
                    </UiCardTitle>
                </UiCardHeader>
                <UiCardContent>
                    <UiCardDescription>0</UiCardDescription>
                </UiCardContent>
            </UiCard>
        </div>
        <hr class="border-dashed" />
        <div class="grid grid-cols-3 justify-items-center gap-4">
            <div></div>
            <UiCard>
                <UiCardHeader>
                    <UiCardTitle>Pemilihan</UiCardTitle>
                </UiCardHeader>
                <UiCardContent>
                    <UiCardDescription>
                        Pastikan kandidat dan whitelist sudah terisi sebelum
                        memulai pemilihan.
                    </UiCardDescription>
                </UiCardContent>
                <UiCardFooter>
                    <UiButton color="primary" class="w-full">
                        Mulai Pemilihan
                    </UiButton>
                </UiCardFooter>
            </UiCard>
            <div></div>
        </div>
    </div>
</template>
