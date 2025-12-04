<script lang="ts" setup>
const alertStore = useAlertStore();

const form = reactive({
    title: '',
    description: '',
    logo: null as File | null,
});

const tempLogo = ref('');
const isLoading = ref(false);

const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            tempLogo.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        form.logo = file;
    };
    input.click();
};

const submit = async () => {
    alertStore.clear();

    if (!form.title || !form.description || !form.logo) {
        alertStore.show('Lengkapi form terlebih dahulu!', 'error');
        return;
    }

    isLoading.value = true;

    const formData = new FormData();

    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('logo', form.logo);

    const { error } = await useApiFetch('/events', {
        method: 'POST',
        data: formData,
    });

    if (error.value) {
        isLoading.value = false;
        return;
    }

    navigateTo('/admin');
};
</script>

<template>
    <div class="grid gap-4">
        <div>
            <h1 class="text-xl">Event Baru</h1>
            <p class="text-sm text-muted-foreground">
                Buat event pemilihan baru
            </p>
        </div>
        <form class="2xl:w-3/4 grid gap-4" @submit.prevent="submit">
            <Alert />
            <div class="flex flex-col items-center justify-center gap-2">
                <div class="text-sm font-medium text-foreground">
                    Pilih Logo
                </div>
                <UiAvatar size="lg" class="relative">
                    <UiAvatarImage
                        v-if="tempLogo"
                        :src="tempLogo"
                        class="object-cover"
                    />
                    <div
                        class="absolute w-full h-full flex items-center justify-center bg-white bg-opacity-0 transition cursor-pointer group hover:bg-opacity-75"
                        @click="openFilePicker"
                    >
                        <Icon
                            name="fluent:upload-24-regular"
                            size="24"
                            class="opacity-0 group-hover:opacity-100"
                        />
                    </div>
                </UiAvatar>
            </div>
            <div class="grid gap-2">
                <UiLabel>Nama Event</UiLabel>
                <UiInput v-model="form.title" :disabled="isLoading" />
            </div>
            <div class="grid gap-2">
                <UiLabel>Deskripsi</UiLabel>
                <UiTextarea v-model="form.description" :disabled="isLoading" />
            </div>
            <div class="flex gap-2">
                <UiButton :loading="isLoading" type="submit"
                    >Buat Event</UiButton
                >
                <NuxtLink to="/admin">
                    <UiButton :disabled="isLoading" variant="outline">
                        Kembali
                    </UiButton>
                </NuxtLink>
            </div>
        </form>
    </div>
</template>
