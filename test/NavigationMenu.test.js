import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import { NavigationMenu } from  '../src/components/NavigationMenu.js';

suite('NavigationMenu', () => {
    test('is defined', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        assert.instanceOf(el, NavigationMenu);
    });

    test('renders with default properties', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        assert.shadowDom.equal(
            el,
            `
            <nav>
                <div class="left-container">
                    <img class="desktop-logo" src="public/assets/ing-logo.png" alt="Logo" width="100">
                    <img class="mobile-logo" src="public/assets/ing-logo-mobile.png" alt="Logo" width="70">
                </div>
                <div class="right-container">
                    <div class="buttons-container">
                        <button class="nav-button">
                            <img src="public/svg/add-employee.svg" alt="Add" width="20">
                            <span class="button-text">Add Employee</span>
                        </button>
                        <button class="nav-button">
                            <img src="public/svg/employees.svg" alt="Employees" width="20">
                            <span class="button-text">Employees</span>
                        </button>
                    </div>
                    <div class="language-selector">
                        <select>
                            <option value="en" selected>English</option>
                            <option value="tr">Türkçe</option>
                        </select>
                    </div>
                </div>
            </nav>
            `
        );
    });

    test('changes language on selection', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        const select = el.shadowRoot.querySelector('select');
        select.value = 'tr';
        select.dispatchEvent(new Event('change'));
        assert.equal(el.selectedLanguage, 'tr');
        assert.equal(document.documentElement.lang, 'tr');
    });

    test('navigates to employees page on button click', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        const button = el.shadowRoot.querySelectorAll('button')[1];
        button.click();
        assert.equal(window.location.pathname, '/');
    });

    test('navigates to home page on logo click', async () => {
        const el = await fixture(html`<navigation-menu></navigation-menu>`);
        const logo = el.shadowRoot.querySelector('.desktop-logo');
        logo.click();
        assert.equal(window.location.pathname, '/');
    });
});
