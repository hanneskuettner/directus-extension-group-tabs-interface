import { defineInterface } from '@directus/utils';
import InterfaceGroupTabs from './group-tabs.vue';

export default defineInterface({
	id: 'group-tabs',
	name: 'Tab Group',
	description: 'Display fields in a tab group',
	icon: 'tab_group',
	component: InterfaceGroupTabs,
	hideLabel: true,
	hideLoader: true,
	autoKey: true,
	types: ['alias'],
	localTypes: ['group'],
	group: 'group',
	options: [],
});
