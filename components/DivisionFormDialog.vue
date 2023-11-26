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
        name: z.string({ required_error: 'Nama tidak boleh kosong' }),
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
                    <UiDialogTitle>Tambah Divisi</UiDialogTitle>
                </UiDialogHeader>
                <div class="py-4">
                    <Field v-slot="{ componentField }" name="name">
                        <UiFormItem>
                            <UiFormLabel>Nama Divisi</UiFormLabel>
                            <UiFormControl>
                                <UiInput
                                    v-bind="componentField"
                                    :disabled="form.isSubmitting.value"
                                />
                            </UiFormControl>
                            <UiFormDescription>
                                Contoh: BLJ 23, KAHIMA & WAKAHIMA, dll.
                            </UiFormDescription>
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
