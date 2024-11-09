import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import { NotificationMessage } from  '../src/components/NotificationMessage.js';

suite('NotificationMessage', () => {
    test('should be defined', async () => {
        const el = await fixture(html`<notification-message></notification-message>`);
        assert.instanceOf(el, NotificationMessage);
    });

    test('should render with default properties', async () => {
        const el = await fixture(html`<notification-message></notification-message>`);
        assert.equal(el.message, '');
        assert.equal(el.type, '');
        assert.equal(el.duration, 3000);
    });

    test('should display the message and type', async () => {
        const el = await fixture(html`<notification-message message="Test message" type="success"></notification-message>`);
        assert.shadowDom.equal(el, `<div class="notification success">Test message</div>`);
    });

    test('should remove the element after the duration', async () => {
        const el = await fixture(html`<notification-message message="Test message" duration="100"></notification-message>`);
        setTimeout(() => {
            assert.notExists(el.parentNode);
        }, 150);
    });
});
