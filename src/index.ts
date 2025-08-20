console.log('Hello, TypeScript!');

export default function main() {
    console.log('Welcome to your TypeScript project!');
}

// Call the main function if this file is run directly
if (require.main === module) {
    main();
}
