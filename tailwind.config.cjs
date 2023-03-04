const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
const config = {
	content: ["./src/**/*.{html,svelte}", "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",],
	darkMode: 'class',
	safelist: [
		'w-64',
		'w-1/2',
		'rounded-l-lg',
		'rounded-r-lg',
		'bg-gray-200',
		'grid-cols-4',
		'grid-cols-7',
		'h-6',
		'leading-6',
		'h-9',
		'leading-9',
		'shadow-lg'
	],
	theme: {
		extend: {
			accentColor: colors['lime'],
		},
	},
	plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require('flowbite/plugin')],
};

module.exports = config;
