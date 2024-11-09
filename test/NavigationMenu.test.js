import { html, fixture, expect } from '@open-wc/testing';
import '../src/NavigationMenu.js';

describe('NavigationMenu', () => {
    it('has a default title "Navigation Menu"', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        expect(el.title).to.equal('Navigation Menu');
    });

    it('can override the title via attribute', async () => {
        const el = await fixture(html`<navigation-menu title="New Title"></navigation-menu>`);
        expect(el.title).to.equal('New Title');
    });

    it('passes the a11y audit', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        await expect(el).shadowDom.to.be.accessible();
    });

    it('renders a nav', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        expect(el.shadowRoot.querySelector('nav')).to.exist;
    });

    it('renders a select', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        expect(el.shadowRoot.querySelector('select')).to.exist;
    });
});