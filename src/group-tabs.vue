<script setup lang="ts">
import type { Field, ValidationError } from '@directus/types';
import { ref, watch } from 'vue';
import TabGroup from './tab-group.vue';
import TabPanel from './tab-panel.vue';
const props = withDefaults(
	defineProps<{
		field: Field;
		fields: Field[];
		values: Record<string, unknown>;
		initialValues: Record<string, unknown>;
		disabled?: boolean;
		batchMode?: boolean;
		batchActiveFields?: string[];
		primaryKey: string | number;
		loading?: boolean;
		validationErrors?: ValidationError[];
		badge?: string;
		rawEditorEnabled?: boolean;
		direction?: string;
	}>(),
	{
		batchActiveFields: () => [],
		validationErrors: () => [],
	}
);

defineEmits<{
	(e: 'apply', value: Record<string, unknown>): void;
}>();

const activeIndex = ref(0);
const { groupFields, groupValues } = useComputedGroup();

watch(
	() => props.validationErrors,
	(newVal, oldVal) => {
		if (!props.validationErrors) return;
		if (isEqual(newVal, oldVal)) return;

		const includedFieldsWithErrors = props.validationErrors.findIndex((validationError) =>
			groupFields.value.find((rootField) => rootField.field === validationError.field)
		);

		if (includedFieldsWithErrors !== -1) activeIndex.value = includedFieldsWithErrors;
	}
);

function isEqual(obj1: any, obj2: any) {
	if (obj1 === obj2) return true;
	if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
	if (obj1 === null || obj2 === null) return false;
	if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
	if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		for (let i = 0; i < obj1.length; i++) {
			if (!isEqual(obj1[i], obj2[i])) return false;
		}
	}
	for (const key in obj1) {
		if (!isEqual(obj1[key], obj2[key])) return false;
	}
	return true;
}

function useComputedGroup() {
	const groupFields = ref<Field[]>(limitFields());
	const groupValues = ref<Record<string, any>>({});

	watch(
		() => props.fields,
		() => {
			const newVal = limitFields();

			if (!isEqual(groupFields.value, newVal)) {
				groupFields.value = newVal;
			}
		}
	);

	watch(
		() => props.values,
		(newVal) => {
			if (!isEqual(groupValues.value, newVal)) {
				groupValues.value = newVal;
			}
		}
	);

	return { groupFields, groupValues };

	function limitFields(): Field[] {
		return props.fields.filter((field) => field.meta?.group === props.field.meta?.field);
	}
}
</script>

<template>
	<tab-group
		v-model="activeIndex"
		:tab-fields="groupFields"
		:fields="fields"
		:values="groupValues"
		:validation-errors="validationErrors!"
		class="group-tabs"
	>
		<template v-for="(groupField, index) in groupFields" :key="groupField.field">
			<tab-panel
				v-if="activeIndex === index"
				:field="groupField"
				:fields="fields"
				:values="groupValues"
				:initial-values="initialValues"
				:disabled="disabled"
				:batch-mode="batchMode"
				:batch-active-fields="batchActiveFields"
				:primary-key="primaryKey"
				:loading="loading"
				:validation-errors="validationErrors"
				:badge="badge"
				:raw-editor-enabled="rawEditorEnabled"
				:group="field.meta.field"
				:direction="direction"
				@apply="$emit('apply', $event)"
			/>
		</template>
	</tab-group>
</template>

<style scoped lang="scss">
.group-tabs {
	.tab-panel {
		margin-top: var(--form-horizontal-gap);
	}
}
</style>

