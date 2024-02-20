import InterfaceGroupTabs from './group-tabs.vue';

export default {
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
	options: [
		{
			field: 'fillWidth',
			type: 'boolean',
			name: 'Overwrite Group Width',
			meta: {
				interface: 'boolean',
				note: 'Normally groups can not fill the width of the page. This option allows you to overwrite that.',
				options: {
					label: 'Fill Width',
				},
				width: 'half',
			},
			schema: {
				default_value: false,
			},
		},
	],
};
