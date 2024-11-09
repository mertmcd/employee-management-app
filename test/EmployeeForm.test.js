import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import { EmployeeForm } from  '../src/components/EmployeeForm.js';

suite('EmployeeForm', () => {
    test('is defined', async () => {
        const el = await fixture(html`<employee-form></employee-form>`);
        assert.instanceOf(el, EmployeeForm);
    });

    test('validates form correctly', async () => {
        const el = await fixture(html`<employee-form></employee-form>`);
        const form = el.shadowRoot.querySelector('form');
        form.querySelector('[name="firstName"]').value = 'John';
        form.querySelector('[name="lastName"]').value = 'Doe';
        form.querySelector('[name="dateOfEmployment"]').value = '2023-01-01';
        form.querySelector('[name="dateOfBirth"]').value = '1990-01-01';
        form.querySelector('[name="phone"]').value = '1234567890';
        form.querySelector('[name="email"]').value = 'john.doe@example.com';

        assert.isTrue(el.validateForm());
    });

    test('shows notification on invalid form', async () => {
        const el = await fixture(html`<employee-form></employee-form>`);
        const form = el.shadowRoot.querySelector('form');
        form.querySelector('[name="firstName"]').value = 'J';
        form.querySelector('[name="lastName"]').value = 'D';
        form.querySelector('[name="dateOfEmployment"]').value = '';
        form.querySelector('[name="dateOfBirth"]').value = '';
        form.querySelector('[name="phone"]').value = '123';
        form.querySelector('[name="email"]').value = 'invalid-email';

        assert.isFalse(el.validateForm());
    });

    test('saves new employee', async () => {
        const el = await fixture(html`<employee-form></employee-form>`);
        const form = el.shadowRoot.querySelector('form');
        form.querySelector('[name="firstName"]').value = 'John';
        form.querySelector('[name="lastName"]').value = 'Doe';
        form.querySelector('[name="dateOfEmployment"]').value = '2023-01-01';
        form.querySelector('[name="dateOfBirth"]').value = '1990-01-01';
        form.querySelector('[name="phone"]').value = '1234567890';
        form.querySelector('[name="email"]').value = 'john.doe@example.com';
        form.querySelector('[name="department"]').value = 'Tech';
        form.querySelector('[name="position"]').value = 'Senior';

        el.saveOrEditEmployee();
        const employees = JSON.parse(localStorage.getItem('employees'));
        assert.equal(employees.length, 1);
        assert.equal(employees[0].firstName, 'John');
    });
});