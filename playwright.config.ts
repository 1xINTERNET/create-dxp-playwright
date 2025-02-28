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
import { defineConfig } from '@playwright/test';
import type { TestFixtures } from './tests/baseFixtures';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export default defineConfig<TestFixtures>({
  timeout: 120 * 1000,
  testDir: './tests',
  reporter: 'list',
  workers: process.env.CI ? 1 : undefined,
  outputDir: fs.mkdtempSync(path.join(os.tmpdir(), 'create-playwright-test-')), // place test dir outside to prevent influece from `yarn.lock` or `package.json` in repo
  projects: [
    {
      name: 'npm',
      use: {
        packageManager: 'npm'
      },
    },
    {
      name: 'yarn-classic',
      use: {
        packageManager: 'npx yarn@1'
      }
    },
    {
      name: 'yarn',
      use: {
        packageManager: 'yarn'
      }
    },
    {
      name: 'pnpm',
      use: {
        packageManager: 'pnpm'
      }
    },
  ]
});
