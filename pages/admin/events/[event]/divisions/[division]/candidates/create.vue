<script lang="ts" setup>
import * as z from 'zod';

const route = useRoute();
const alertStore = useAlertStore();

const formSchema = toTypedSchema(
    z.object({
        first: z.string({
            required_error: 'Kandidat pertama tidak boleh kosong',
        }),
        first_name: z.string({
            required_error: 'Nama tidak boleh kosong',
        }),
        second: z.optional(z.string()),
        second_name: z.optional(z.string()),
        vision: z.string({
            required_error: 'Visi tidak boleh kosong',
        }),
        mission: z.string({
            required_error: 'Visi tidak boleh kosong',
        }),
        picture: z.any(),
        order: z.string({
            required_error: 'Urutan tidak boleh kosong',
        }),
    }),
);

const form = useForm({
    validationSchema: formSchema,
});

const tempLogo = ref('');

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
        form.setFieldValue('picture', file);
    };
    input.click();
};

const submit = form.handleSubmit(async (values) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if ((key === 'second' || key === 'second_name') && !value) {
            continue;
        }

        formData.append(key, value);
    }

    formData.append('division_id', route.params.division as string);

    const { error } = await useApiFetch(
        `/events/${route.params.event}/candidates`,
        {
            method: 'POST',
            body: formData,
        },
    );

    if (error.value) {
        alertStore.show(error.value.message, 'error');
        return;
    }

    navigateTo(
        `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates`,
    );
});
</script>

<template>
    <div class="grid gap-4">
        <div>
            <BackButton
                :to="`/admin/events/${route.params.event}/divisions/${route.params.division}/candidates`"
            />
        </div>
        <div>
            <h1 class="text-xl">Kandidat Baru</h1>
            <p class="text-sm text-muted-foreground">
                Tambahkan kandidat baru untuk divisi ini.
            </p>
        </div>
        <form class="2xl:w-3/4 grid gap-4" @submit="submit">
            <Alert />
            <div class="grid gap-4 mb-4">
                <Field v-slot="{ componentField }" name="first">
                    <UiFormItem>
                        <UiFormLabel>NPM Kandidat Pertama</UiFormLabel>
                        <UiFormControl>
                            <UiInput
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="first_name">
                    <UiFormItem>
                        <UiFormLabel>Nama Kandidat Pertama</UiFormLabel>
                        <UiFormControl>
                            <UiInput
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormDescription>
                            Contoh: Prabowo, dll.
                        </UiFormDescription>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="second">
                    <UiFormItem>
                        <UiFormLabel>NPM Kandidat Kedua</UiFormLabel>
                        <UiFormControl>
                            <UiInput
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="second_name">
                    <UiFormItem>
                        <UiFormLabel>Nama Kandidat Kedua</UiFormLabel>
                        <UiFormControl>
                            <UiInput
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormDescription>
                            Contoh: Sandiaga Uno, dll.
                        </UiFormDescription>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="order">
                    <UiFormItem>
                        <UiFormLabel>Urutan</UiFormLabel>
                        <UiFormControl>
                            <UiInput
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormDescription>
                            Contoh: 1, 2, 3, dll.
                        </UiFormDescription>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="vision">
                    <UiFormItem>
                        <UiFormLabel>Visi</UiFormLabel>
                        <UiFormControl>
                            <UiTextarea
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="mission">
                    <UiFormItem>
                        <UiFormLabel>Misi</UiFormLabel>
                        <UiFormControl>
                            <UiTextarea
                                v-bind="componentField"
                                :disabled="form.isSubmitting.value"
                            />
                        </UiFormControl>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <Field v-slot="{ componentField }" name="picture">
                    <UiFormItem>
                        <UiFormLabel>Foto</UiFormLabel>
                        <div class="flex gap-2">
                            <img
                                v-if="tempLogo"
                                :src="tempLogo"
                                class="w-1/3 rounded-lg"
                            />
                            <UiFormControl>
                                <UiButton
                                    :disabled="form.isSubmitting.value"
                                    type="button"
                                    variant="outline"
                                    @click="openFilePicker"
                                >
                                    Pilih Foto
                                </UiButton>
                                <input
                                    type="file"
                                    accept="image/*"
                                    v-bind="componentField"
                                    style="display: none"
                                />
                            </UiFormControl>
                        </div>
                        <UiFormMessage />
                    </UiFormItem>
                </Field>
                <div class="flex gap-2">
                    <UiButton
                        variant="outline"
                        type="button"
                        @click="
                            navigateTo(
                                `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates`,
                            )
                        "
                    >
                        Kembali
                    </UiButton>
                    <UiButton :loading="form.isSubmitting.value" type="submit">
                        Simpan
                    </UiButton>
                </div>
            </div>
        </form>
    </div>
</template>
