import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Broker Frontend (Broker---FE) Test Suite', () => {
  const rootDir = path.resolve('.');

  test('Routes Configuration: broker routes defined correctly', async () => {
    const routerPath = path.join(rootDir, 'src', 'routes', 'AppRouter.jsx');
    assert.ok(fs.existsSync(routerPath), 'AppRouter.jsx must exist');
    const content = fs.readFileSync(routerPath, 'utf8');

    assert.ok(content.includes('BrokerLayout'), 'Must include BrokerLayout');
    assert.ok(content.includes('BrokerAuthProvider'), 'Must include BrokerAuthProvider');
    assert.ok(content.includes('BrokerHomePage'), 'Must include BrokerHomePage');
    assert.ok(content.includes('BrokerAgreementsPage'), 'Must include BrokerAgreementsPage');
    assert.ok(content.includes('BrokerClientsPage'), 'Must include BrokerClientsPage');
    assert.ok(content.includes('BrokerBillingPage'), 'Must include BrokerBillingPage');
    assert.ok(content.includes('BrokerHelpPage'), 'Must include BrokerHelpPage');
    assert.ok(content.includes('BrokerReferPage'), 'Must include BrokerReferPage');
    assert.ok(content.includes('BrokerBankUpiPage'), 'Must include BrokerBankUpiPage');

    assert.strictEqual(content.includes('AdminLayout'), false, 'Must NOT reference AdminLayout');
    assert.strictEqual(content.includes('ProtectedAdminRoute'), false, 'Must NOT reference ProtectedAdminRoute');
  });

  test('Route Protection: Broker and User route guards exist', async () => {
    const guardPath = path.join(rootDir, 'src', 'routes', 'ProtectedRoute.jsx');
    assert.ok(fs.existsSync(guardPath), 'ProtectedRoute.jsx must exist');
    const content = fs.readFileSync(guardPath, 'utf8');

    assert.ok(content.includes('ProtectedBrokerRoute'), 'Must export ProtectedBrokerRoute');
    assert.ok(content.includes('ProtectedUserRoute'), 'Must export ProtectedUserRoute');
    assert.strictEqual(content.includes('ProtectedAdminRoute'), false, 'Must NOT export ProtectedAdminRoute');
  });

  test('Compatibility Adapter: src/context/useAuth.js exists and exports useBrokerAuth', () => {
    const adapterPath = path.join(rootDir, 'src', 'context', 'useAuth.js');
    assert.ok(fs.existsSync(adapterPath), 'src/context/useAuth.js compatibility adapter must exist');
    const content = fs.readFileSync(adapterPath, 'utf8');
    assert.ok(content.includes('useBrokerAuth'), 'Must export useBrokerAuth as useAuth');
  });

  test('Broker Contexts: BrokerAuthContext and BrokerStateContext exist', () => {
    assert.ok(fs.existsSync(path.join(rootDir, 'src', 'contexts', 'BrokerAuthContext.jsx')), 'BrokerAuthContext must exist');
    assert.ok(fs.existsSync(path.join(rootDir, 'src', 'contexts', 'BrokerStateContext.jsx')), 'BrokerStateContext must exist');
    assert.ok(fs.existsSync(path.join(rootDir, 'src', 'hooks', 'useBrokerAuth.js')), 'useBrokerAuth hook must exist');
  });

  test('Broker Screens: all primary screens are present', () => {
    const screens = [
      'HomeDashboard',
      'MyAgreements',
      'ClientsVault',
      'PlanBilling',
      'HelpSupport',
      'ReferEarn',
      'BankUpiSettings'
    ];
    for (const screen of screens) {
      assert.ok(fs.existsSync(path.join(rootDir, 'src', 'screens', screen)), `Screen ${screen} directory must exist`);
    }
  });

  test('Security & Environment: .env is gitignored and .env.example exists', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    assert.ok(fs.existsSync(gitignorePath), '.gitignore must exist');
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    assert.ok(gitignore.includes('.env'), '.gitignore must ignore .env');
    assert.ok(fs.existsSync(path.join(rootDir, '.env.example')), '.env.example must exist');

    const envExample = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf8');
    assert.ok(envExample.includes('VITE_AWS_REGION'), '.env.example should contain AWS region configuration');
    assert.ok(envExample.includes('VITE_COGNITO_USER_POOL_ID'), '.env.example should contain Cognito User Pool configuration');
    assert.ok(envExample.includes('VITE_COGNITO_CLIENT_ID'), '.env.example should contain Cognito app-client configuration');
  });

  test('Production Build Artifacts: bundle exists and is valid', () => {
    const distPath = path.join(rootDir, 'dist');
    assert.ok(fs.existsSync(distPath), 'dist directory must exist');
    assert.ok(fs.existsSync(path.join(distPath, 'index.html')), 'dist/index.html must exist');
    
    const assetsDir = path.join(distPath, 'assets');
    assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist');
    const files = fs.readdirSync(assetsDir);
    assert.ok(files.some(f => f.endsWith('.js')), 'JS bundles must exist in dist/assets');
    assert.ok(files.some(f => f.endsWith('.css')), 'CSS bundles must exist in dist/assets');
  });
});
