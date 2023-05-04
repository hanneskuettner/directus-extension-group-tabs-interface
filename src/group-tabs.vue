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
				v-show="activeIndex === index"
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

<script setup lang="ts">
import { Field, ValidationError } from '@directus/types';
import { isEqual } from 'lodash-es';
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
		accordionMode: true,
		start: 'closed',
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

<style scoped lang="scss">
.group-tabs {
	.tab-panel {
		margin-top: var(--form-horizontal-gap);
	}
}
</style>
