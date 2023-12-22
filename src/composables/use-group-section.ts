import type { Field, ValidationError } from '@directus/types';
import { Ref, computed, unref } from 'vue';
import { useI18n } from 'vue-i18n';

interface UseGroupSectionOptions {
	field: Ref<Field>;
	fields: Ref<Field[]>;
	values: Ref<Record<string, unknown>>;
	validationErrors: Ref<ValidationError[]>;
}

export function useGroupSection({ field, fields: groupFields, values, validationErrors }: UseGroupSectionOptions) {
	const { t } = useI18n();

	const fieldsInSection = computed(() => {
		const fields: Field[] = [Object.assign({}, unref(field), { hideLabel: true })];

		if (unref(field).meta?.special?.includes('group')) {
			fields.push(...getFieldsForGroup(unref(field).meta?.field, [], unref(groupFields)));
		}

		return fields;
	});

	const edited = computed(() => {
		if (!unref(values)) return false;

		const editedFields = Object.keys(unref(values));
		return fieldsInSection.value.some((field) => editedFields.includes(field.field));
	});

	const validationMessage = computed(() => {
		const validationError = unref(validationErrors).find(
			(error) =>
				error.field === unref(field).field || unref(fieldsInSection).find((field) => field.field === error.field)
		);
		if (validationError === undefined) return;

		if (validationError.code === 'RECORD_NOT_UNIQUE') {
			return t('validationError.unique');
		} else {
			return t(`validationError.${validationError.type}`, validationError);
		}
	});

	return { fieldsInSection, edited, validationMessage };
}

function getFieldsForGroup(group: undefined | string, passed: string[] = [], groupFields: Field[]): Field[] {
	const fieldsInGroup: Field[] = groupFields.filter((field) => {
		return field.meta?.group === group || (group === null && !field.meta);
	});

	for (const field of fieldsInGroup) {
		if (field.meta?.special?.includes('group') && !passed.includes(field.meta!.field)) {
			passed.push(field.meta!.field);
			fieldsInGroup.push(...getFieldsForGroup(field.meta!.field, passed, groupFields));
		}
	}

	return fieldsInGroup;
}
