<script setup lang="ts">
import type { Field, ValidationError } from '@directus/types';
import { toRefs } from 'vue';
import { useGroupSection } from './composables/use-group-section';

const props = withDefaults(
	defineProps<{
		field: Field;
		fields: Field[];
		values: Record<string, unknown>;
		initialValues: Record<string, unknown>;
		disabled?: boolean;
		batchMode?: boolean;
		batchActiveFields?: string[];
		primaryKey: number | string;
		loading?: boolean;
		validationErrors?: ValidationError[];
		group: string;
		multiple?: boolean;
		direction?: string;
	}>(),
	{
		batchActiveFields: () => [],
		validationErrors: () => [],
	}
);

const { fieldsInSection } = useGroupSection(toRefs(props));
</script>

<template>
	<div :id="`tabpanel-${field.field}`" class="tab-panel">
		<v-form
			:initial-values="initialValues"
			:fields="fieldsInSection"
			:model-value="values"
			:primary-key="primaryKey"
			:group="group"
			:validation-errors="validationErrors"
			:loading="loading"
			:batch-mode="batchMode"
			:disabled="disabled"
			:direction="direction"
			:show-no-visible-fields="false"
			:show-validation-errors="false"
			@update:model-value="$emit('apply', $event)"
		/>
	</div>
</template>

<style lang="scss" scoped>
.accordion-section {
	border-top: var(--border-width) solid var(--border-normal);

	&:last-child {
		border-bottom: var(--border-width) solid var(--border-normal);
	}
}

.icon {
	margin-right: 12px;
	transform: rotate(-90deg);
	transition: transform var(--fast) var(--transition);

	&.active {
		transform: rotate(0);
	}
}

.warning {
	margin-left: 8px;
	color: var(--danger);
}

.fields {
	margin: var(--form-vertical-gap) 0;
}
</style>
