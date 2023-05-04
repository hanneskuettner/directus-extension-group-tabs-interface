module.exports = {
	htmlWhitespaceSensitivity: 'ignore',
	printWidth: 120,
	singleQuote: true,
	useTabs: true,
	proseWrap: 'always',
	overrides: [
		{
			files: ['*.yaml', '*.yml', 'package.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
		{
			files: ['Dockerfile', 'Makefile'],
			options: {
				useTabs: true,
			},
		},
	],
};
