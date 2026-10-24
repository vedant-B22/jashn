import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

declare module 'vitest' {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
}
