// Verify route selection and exclusions without sending analytics requests.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  stdin: { resolveDir: root, loader: 'tsx', contents: `
    import assert from 'node:assert/strict';
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import { MemoryRouter } from 'react-router-dom';
    import SiteAnalytics, { filterPageview } from './src/components/SiteAnalytics';
    globalThis.analyticsTestEnv = { PROD: true, MODE: 'production' };
    globalThis.window = { __MILANO_OFFLINE__: false };
    globalThis.location = { hostname: 'milanoracing.team', protocol: 'https:' };
    function render(path) {
      return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><SiteAnalytics /></MemoryRouter>);
    }
    for (const path of ['/', '/team', '/evolution', '/partners', '/journal', '/journal/jersey', '/journal/livery', '/journal/drag-log']) {
      assert.ok(render(path).includes('data-path="' + path + '"'), path);
      assert.equal(filterPageview({ type: 'pageview', url: 'https://milanoracing.team' + path + '?name=PRIVATE#number' }).url, 'https://milanoracing.team' + path);
    }
    for (const path of ['/racing', '/private', '/unknown']) {
      assert.equal(filterPageview({ type: 'pageview', url: 'https://milanoracing.team' + path }), null);
      assert.ok(!render(path).includes('data-path='));
    }
    assert.equal(render('/team?name=PRIVATE#quote'), render('/team'));
    assert.equal(filterPageview({ type: 'event', url: 'https://milanoracing.team/team' }), null);
    globalThis.analyticsTestEnv.MODE = 'private-game'; assert.equal(render('/'), '');
    globalThis.analyticsTestEnv.MODE = 'production';
    globalThis.analyticsTestEnv.PROD = false; assert.equal(render('/'), '');
    globalThis.analyticsTestEnv.PROD = true;
    window.__MILANO_OFFLINE__ = true; assert.equal(render('/'), '');
    window.__MILANO_OFFLINE__ = false;
    for (const hostname of ['localhost', '127.0.0.1', '[::1]']) {
      location.hostname = hostname; assert.equal(render('/'), '');
    }
    location.hostname = 'milanoracing.team';
    location.protocol = 'file:'; assert.equal(render('/'), '');
    location.protocol = 'http:'; assert.equal(render('/'), '');
    console.log('PASS: public routes, query/hash removal, private/offline/local exclusions. No events sent.');
  ` },
  bundle: true, platform: 'node', format: 'cjs', write: false,
  jsx: 'automatic', define: { 'import.meta.env': 'globalThis.analyticsTestEnv' },
  plugins: [{ name: 'analytics-recorder', setup(build) {
    build.onResolve({ filter: /^@vercel\/analytics\/react$/ }, () => ({ path: 'analytics', namespace: 'test' }));
    build.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
      contents: `import React from 'react'; export function Analytics(props) { return React.createElement('output', { 'data-path': props.path, 'data-route': props.route }); }`,
      resolveDir: root,
    }));
  } }],
});
const { createRequire } = await import('node:module');
new Function('require', result.outputFiles[0].text)(createRequire(import.meta.url));
