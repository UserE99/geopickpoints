import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'babel-jest', // Wandelt TypeScript und JSX um
    },
    transformIgnorePatterns: [
        '/node_modules/', // Ignoriert node_modules
    ],
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/setupTests.ts',  // Mock für CSS-Dateien
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/setupTests.ts'  // Mock für Bilddateien
    },
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    
};

export default config;
