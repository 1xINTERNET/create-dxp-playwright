/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { test, expect, assertLockFilesExist, packageManagerToNpxCommand } from './baseFixtures';
import path from 'path';
import fs from 'fs';

test('should be able to generate and run a CT React project', async ({ run, dir, exec, packageManager }) => {
  test.skip(packageManager === 'yarn');
  test.slow();
  await run(['--ct'], { installGitHubActions: true, testDir: 'tests', language: 'TypeScript', installPlaywrightDependencies: false, installPlaywrightBrowsers: true, framework: 'react' });
  {
    expect(fs.existsSync(path.join(dir, 'playwright/index.html'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'playwright-ct.config.ts'))).toBeTruthy();
    assertLockFilesExist(dir, packageManager);
  }

  {
    expect(fs.existsSync(path.join(dir, '.github/workflows/playwright.yml'))).toBeTruthy();
    expect(fs.readFileSync(path.join(dir, '.github/workflows/playwright.yml'), 'utf8')).toContain('test-ct');
  }

  await exec(packageManager, [(packageManager === 'yarn' ? 'add' : 'install'), 'react', 'react-dom']);

  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src/App.tsx'), 'export default () => <>Learn React</>;');
  fs.mkdirSync(path.join(dir, 'tests'));
  fs.writeFileSync(path.join(dir, 'tests/App.spec.tsx'), `
    import { test, expect } from '@playwright/experimental-ct-react';
    import App from '../src/App';

    test.use({ viewport: { width: 500, height: 500 } });

    test('should work', async ({ mount }) => {
      const component = await mount(<App />);
      await expect(component).toContainText('Learn React');
    });
  `);

  await exec(packageManagerToNpxCommand(packageManager), ['playwright', 'install-deps']);
  await exec(packageManager, ['run', 'test-ct']);
});
