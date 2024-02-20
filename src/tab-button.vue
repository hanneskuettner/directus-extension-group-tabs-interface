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
		v-if="!field.meta?.hidden"
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
.tab-button {
	--v-button-background-color: transparent;
	--v-button-background-color-hover: transparent;
	--v-button-border-color: transparent;
	--v-button-width: unset;

	& :deep(.content) {
		overflow: visible;
	}

	&[aria-selected='true'] {
		--v-button-border-color: var(--theme--background-accent);
		--v-button-background-color: var(--theme--background-accent);
		--v-button-background-color-hover: var(--theme--background-accent);
	}

	&:not([aria-selected='true']):hover {
		color: var(--theme--foreground--accent);
	}

	&:hover,
	&[aria-selected='true'] {
		.field-name,
		.icon {
			color: var(--theme--foreground-accent);
		}

		.edit-dot {
			background-color: var(--theme--foreground);
		}
	}

	.field-name,
	.icon {
		color: var(--theme--foreground);
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
		background-color: var(--theme--foreground-subdued);
		border-radius: 4px;
		content: '';
	}
}

.warning {
	margin-left: 8px;
	color: var(--theme--danger);
}
</style>
