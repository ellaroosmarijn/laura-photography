import type { Environment } from 'vitest';

export default <Environment>{
    name: 'prisma',
    setup() {
        // custom setup
        return {
            teardown() {
                // called after all tests with this env have been run
            }
        }
    }
}
