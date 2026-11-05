import {randomUUID} from 'node:crypto';

// Page.reload's response acknowledges the command, not the new document's load.
// The loader ID gates navigation; the marker rejects an outgoing execution
// context even if Runtime.evaluate briefly still selects it after the commit.
export function createBrowserReadiness({send, run, predicate, label = 'App', attempts = 300, pause = ms => new Promise(resolve => setTimeout(resolve, ms))}) {
  const frame = async () => (await send('Page.getFrameTree')).frameTree.frame;
  async function ready({previousLoaderId, marker} = {}) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        const before = await frame();
        if ((!previousLoaderId || before.loaderId !== previousLoaderId) &&
            await run(`document.readyState === 'complete' && ${marker ? `document.__harumalQANavigation !== ${JSON.stringify(marker)} && ` : ''}(${predicate})`)) {
          // Do not accept a successful evaluation spanning another navigation.
          const after = await frame();
          if (before.id === after.id && before.loaderId === after.loaderId) return;
        }
      } catch (error) {
        // Context destruction is expected during a real navigation.
        lastError = error;
      }
      await pause(100);
    }
    throw new Error(`${label} boot timeout${previousLoaderId ? ' after document navigation' : ''}${lastError ? ': ' + lastError.message : ''}`);
  }
  async function navigate(method, params = {}) {
    const previous = await frame(), marker = randomUUID();
    await run(`document.__harumalQANavigation = ${JSON.stringify(marker)}`);
    const result = await send(method, params);
    if (result.errorText) throw new Error(`${label} navigation failed: ${result.errorText}`);
    await ready({previousLoaderId: previous.loaderId, marker});
  }
  return {ready, navigate};
}
