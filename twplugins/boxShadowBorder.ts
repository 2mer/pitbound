import plugin from 'tailwindcss/plugin';

export default plugin(function ({ matchUtilities, theme }) {

	matchUtilities(
		{
			// Class name
			'box-shadow-border': (value) => {
				return {
					boxShadow: `0px 0px 0px ${value} var(--tw-shadow-color)`,
				}
			},

			'inset-box-shadow-border': (value) => {
				return {
					boxShadow: `inset 0px 0px 0px ${value} var(--tw-shadow-color)`,
				}
			},
		},
		// Default values.
		// `flattenColorPalette` required to support native Tailwind color classes like `red-500`, `amber-300`, etc. 
		// In most cases you may just pass `theme('config-key')`, where `config-key` could be any (`spacing`, `fontFamily`, `foo`, `bar`)
		{ values: theme('borderWidth') }
	)
});