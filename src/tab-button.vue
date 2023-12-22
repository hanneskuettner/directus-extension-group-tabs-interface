<script lang="ts" setup>
import { Field, ValidationError } from '@directus/types';
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGroupSection } from './composables/use-group-section';

const props = defineProps<{
	field: Field;
	fields: Field[];
	values: Record<string, unknown>;
	validationErrors: ValidationError[];
	active: boolean;
	badge?: string;
}>();

const { edited, validationMessage } = useGroupSection(toRefs(props));
const { t } = useI18n();
</script>

<template>
	<v-button
		:id="`tab-${field.field}`"
		class="tab-button"
		role="tab"
		:aria-selected="active ? 'true' : 'false'"
		:aria-controls="`tabpanel-${field.field}`"
		small
	>
		<span v-if="edited" v-tooltip="t('edited')" class="edit-dot"></span>
		<span class="field-name">{{ field.name }}</span>
		<v-chip v-if="badge" x-small>{{ badge }}</v-chip>
		<v-icon v-if="validationMessage" v-tooltip="validationMessage" class="warning" name="error" small />
	</v-button>
</template>

<style scoped lang="scss">
.v-button {
	--v-button-background-color: transparent;
	--v-button-background-color-hover: transparent;
	--v-button-border-color: transparent;
	--v-button-width: unset;

	:deep(.button) {
		border-color: var(--v-button-border-color);

		.content {
			overflow: visible;
		}

		&:focus {
			--v-button-border-color: var(--primary);
		}
	}

	&[aria-selected='true'] {
		--v-button-border-color: var(--background-normal-alt);
		--v-button-background-color: var(--background-normal-alt);
		--v-button-background-color-hover: var(--background-normal-alt);
	}

	&:not([aria-selected='true']):hover {
		--v-button-border-color: var(--background-normal);
		--v-button-background-color: var(--background-normal);
		--v-button-background-color-hover: var(--background-normal);
	}

	&:hover,
	&[aria-selected='true'] {
		.field-name,
		.icon {
			color: var(--foreground-normal-alt);
		}

		.edit-dot {
			background-color: var(--foreground-normal);
		}
	}

	.field-name,
	.icon {
		color: var(--foreground-normal);
		transition: color var(--fast) var(--transition);
	}

	.v-chip {
		margin: 0 0 0 8px;
	}

	.edit-dot {
		position: absolute;
		top: 7px;
		left: -7px;
		display: block;
		width: 4px;
		height: 4px;
		background-color: var(--foreground-subdued);
		border-radius: 4px;
		content: '';
	}
}

.warning {
	margin-left: 8px;
	color: var(--danger);
}
</style>

