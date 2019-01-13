import App from './src/ui';

import {h, render} from 'preact';
import htm from 'htm';
const html = htm.bind(h);

render(html`<${App} program="tank"/>`, document.getElementById('root')!);