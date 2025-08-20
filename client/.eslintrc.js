module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Prevent importing server-side services in client components
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/services/*.server'],
            message: 'Server services cannot be imported in client components.'
          }
        ]
      }
    ],
    
    // Other custom rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    // Allow certain rules in specific files
    {
      files: ['src/app/api/**/*.ts', 'src/middleware.ts'],
      rules: {
        'no-restricted-imports': 'off', // Allow server imports in API routes
      }
    }
  ]
}; 