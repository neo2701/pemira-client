<script lang="ts" setup>
import * as z from 'zod';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const alertStore = useAlertStore();

const baseURL = runtimeConfig.public.apiBase + '/../storage/';

const candidate = ref<Candidate>();
const confirmDelete = ref(false);

const formSchema = toTypedSchema(
    z.object({
        first: z.string({
            required_error: 'Kandidat pertama tidak boleh kosong',
        }),
        first_name: z.string({
            required_error: 'Nama tidak boleh kosong',
        }),
        second: z.optional(z.nullable(z.string())),
        second_name: z.optional(z.nullable(z.string())),
        vision: z.string({
            required_error: 'Visi tidak boleh kosong',
        }),
        mission: z.string({
            required_error: 'Visi tidak boleh kosong',
        }),
        picture: z.any(),
        order: z.coerce.number({
            required_error: 'Urutan tidak boleh kosong',
            invalid_type_error: 'Urutan harus berupa angka',
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

const getCandidate = async () => {
    const { data, statusCode } = await useApiFetch(
        `/events/${route.params.event}/candidates/${route.params.candidate}`,
    );

    if (statusCode.value === 404) {
        navigateTo(
            `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates`,
        );
        return;
    }

    candidate.value = data.value;

    form.setValues({
        first: data.value.first,
        first_name: data.value.first_name,
        second: data.value.second,
        second_name: data.value.second_name,
        vision: data.value.vision,
        mission: data.value.mission,
        order: data.value.order,
    });
};

const submit = form.handleSubmit(async (values) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if ((key === 'second' || key === 'second_name') && !value) {
            continue;
        } else if (key === 'picture' && !value) {
            continue;
        }

        formData.append(key, value);
    }

    formData.append('division_id', route.params.division as string);

    const { error } = await useApiFetch(
        `/events/${route.params.event}/candidates/${route.params.candidate}?_method=put`,
        {
            method: 'POST',
            data: formData,
        },
    );

    if (error.value) {
        alertStore.show(error.value, 'error');
        return;
    }

    navigateTo(
        `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates`,
    );
});

const confirmDeleteCandidate = (confirm: boolean = true) => {
    confirmDelete.value = confirm;
};

const deleteCandidate = async (id: string | number) => {
    const { error } = await useApiFetch(
        `/events/${route.params.event}/candidates/${id}`,
        {
            method: 'DELETE',
        },
    );

    if (error.value) {
        return;
    }

    navigateTo(
        `/admin/events/${route.params.event}/divisions/${route.params.division}/candidates`,
    );
};

onMounted(getCandidate);
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
                                v-if="tempLogo || candidate?.picture"
                                :src="tempLogo || baseURL + candidate?.picture"
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
                <div class="flex justify-between">
                    <UiButton :loading="form.isSubmitting.value" type="submit">
                        Simpan
                    </UiButton>
                    <UiButton
                        v-if="!confirmDelete"
                        :disabled="form.isSubmitting.value"
                        variant="destructive"
                        @click="confirmDeleteCandidate()"
                    >
                        Hapus
                    </UiButton>
                    <div v-else-if="candidate" class="flex gap-2">
                        <UiButton
                            :disabled="form.isSubmitting.value"
                            variant="outline"
                            @click="confirmDeleteCandidate(false)"
                        >
                            Batal
                        </UiButton>
                        <UiButton
                            v-if="confirmDelete"
                            :disabled="form.isSubmitting.value"
                            variant="destructive"
                            @click="deleteCandidate(candidate?.id)"
                        >
                            Konfirmasi Hapus
                        </UiButton>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
