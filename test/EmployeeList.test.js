import { html, fixture, expect } from '@open-wc/testing';
import '../src/EmployeeList.js';

describe('EmployeeList', () => {
    it('has a default title "Employee List"', async () => {
        const el = await fixture(html`<employee-list></employee-list>`);
        expect(el.title).to.equal('Employee List');
    });

    it('can override the title via attribute', async () => {
        const el = await fixture(html`<employee-list title="New Title"></employee-list>`);
        expect(el.title).to.equal('New Title');
    });

    it('passes the a11y audit', async () => {
        const el = await fixture(html`<employee-list></employee-list>`);
        await expect(el).shadowDom.to.be.accessible();
    });

    it('renders a list', async () => {
        const el = await fixture(html`<employee-list></employee-list>`);
        expect(el.shadowRoot.querySelector('ul')).to.exist;
    });

    it('renders a list item', async () => {
        const el = await fixture(html`<employee-list></employee-list>`);
        expect(el.shadowRoot.querySelector('li')).to.exist;
    });
});
    