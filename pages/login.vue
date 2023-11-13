<template>
    <div class="h-[calc(100dvh)] flex items-center justify-center">
        <UiCard class="w-96">
            <UiCardHeader>
                <h2 class="text-3xl">PEMIRA</h2>
                <UiCardDescription class="text-sm mt-0">
                    E-Vote HIMATIFA
                </UiCardDescription>
            </UiCardHeader>
            <UiCardContent class="grid gap-4">
                <div class="grid gap-2">
                    <UiLabel>Email</UiLabel>
                    <UiInput type="email" placeholder="Email" />
                </div>
                <div class="grid gap-2">
                    <UiLabel>Password</UiLabel>
                    <UiInput type="password" placeholder="Masukkan password" />
                </div>
                <UiButton class="w-full">Masuk</UiButton>
                <UiCardDescription class="text-center">atau</UiCardDescription>
                <UiButton variant="outline" class="w-full gap-2">
                    <Icon name="bxl:google" size="16"></Icon> Masuk dengan
                    Google
                </UiButton>
            </UiCardContent>
        </UiCard>
    </div>
</template>
