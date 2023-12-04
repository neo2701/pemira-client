<script lang="ts" setup>
import * as z from 'zod';

const props = defineProps<{
    event: Event;
}>();

const emit = defineEmits<{
    (e: 'success'): void;
}>();

const formSchema = toTypedSchema(
    z.object({
        first: z.string({
            required_error: 'Kandidat pertama tidak boleh kosong',
        }),
        first_name: z.string({
            required_error: 'Kandidat pertama tidak boleh kosong',
        }),
        vision: z.string({
            required_error: 'Visi kandidat tidak boleh kosong',
        }),
        mission: z.string({
            required_error: 'Misi kandidat tidak boleh kosong',
        }),
    }),
);

const form = useForm({
    validationSchema: formSchema,
});

const show = ref();

const submit = form.handleSubmit(async (values) => {
    const { error } = await useApiFetch(`/events/${props.event.id}/divisions`, {
        method: 'POST',
        body: JSON.stringify(values),
    });

    if (!error.value) {
        show.value = false;
        emit('success');
    }
});
</script>

<template>
    <UiDialog v-model:open="show">
        <UiDialogTrigger as-child>
            <slot />
        </UiDialogTrigger>
        <UiDialogContent>
            <form @submit="submit">
                <UiDialogHeader>
                    <UiDialogTitle>Tambah Kandidat</UiDialogTitle>
                </UiDialogHeader>
                <div class="grid gap-4 py-4">
                    <Field v-slot="{ componentField }" name="first">
                        <UiFormItem>
                            <UiFormLabel>Kandidat Pertama</UiFormLabel>
                            <UiFormControl>
                                <UiInput
                                    v-bind="componentField"
                                    :disabled="form.isSubmitting.value"
                                    placeholder="NPM Kandidat Pertama"
                                    @change="console.log('test')"
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
                                    @change="console.log('test')"
                                />
                            </UiFormControl>
                            <UiFormMessage />
                        </UiFormItem>
                    </Field>
                    <Field v-slot="{ componentField }" name="second">
                        <UiFormItem>
                            <UiFormLabel>Kandidat Kedua</UiFormLabel>
                            <UiFormControl>
                                <UiInput
                                    v-bind="componentField"
                                    :disabled="form.isSubmitting.value"
                                    placeholder="NPM Kandidat Kedua"
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
                                    placeholder="Visi Kandidat"
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
                                    placeholder="Misi Kandidat"
                                />
                            </UiFormControl>
                            <UiFormMessage />
                        </UiFormItem>
                    </Field>
                </div>
                <UiDialogFooter>
                    <UiButton :loading="form.isSubmitting.value"
                        >Simpan</UiButton
                    >
                </UiDialogFooter>
            </form>
        </UiDialogContent>
    </UiDialog>
</template>
