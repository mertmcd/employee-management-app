import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/EmployeeForm.js';

describe('EmployeeForm', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(html`<employee-form></employee-form>`);
  });

  it('should render the form with default values', () => {
    expect(el.shadowRoot.querySelector('h2').textContent).to.include('Add New Employee');
    const firstNameInput = el.shadowRoot.querySelector('[name="firstName"]');
    expect(firstNameInput.value).to.equal('');
  });

  it('should fill the form with existing employee data when editing', async () => {
    el.employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: '1234567890',
      email: 'john.doe@example.com',
      department: 'Tech',
      position: 'Senior'
    };
    await el.updateComplete;

    const firstNameInput = el.shadowRoot.querySelector('[name="firstName"]');
    const lastNameInput = el.shadowRoot.querySelector('[name="lastName"]');

    expect(firstNameInput.value).to.equal('John');
    expect(lastNameInput.value).to.equal('Doe');
  });

  it('should validate form inputs correctly', () => {
    const invalidPhoneInput = el.shadowRoot.querySelector('[name="phone"]');
    invalidPhoneInput.value = '12345';

    const isValid = el.validateForm();
    expect(isValid).to.be.false;

    // Bu durumda bir hata bildirimi gösterilmeli
    const notification = el.shadowRoot.querySelector('notification-message');
    expect(notification).to.exist;
    expect(notification.message).to.equal('Phone must be a 10-digit number.');
  });

  it('should add a new employee when the form is valid', async () => {
    const form = el.shadowRoot.querySelector('form');

    // Form değerlerini dolduruyoruz
    form.querySelector('[name="firstName"]').value = 'Jane';
    form.querySelector('[name="lastName"]').value = 'Doe';
    form.querySelector('[name="dateOfEmployment"]').value = '2023-02-01';
    form.querySelector('[name="dateOfBirth"]').value = '1991-01-01';
    form.querySelector('[name="phone"]').value = '0987654321';
    form.querySelector('[name="email"]').value = 'jane.doe@example.com';

    el.saveOrEditEmployee();

    // localStorage'ı kontrol ederek kaydın eklendiğini doğruluyoruz
    const employees = JSON.parse(localStorage.getItem('employees'));
    expect(employees).to.be.an('array');
    expect(employees[0].firstName).to.equal('Jane');
    expect(employees[0].lastName).to.equal('Doe');
  });

  it('should open confirm dialog before editing an employee', async () => {
    el.employee = { id: 1, firstName: 'John', lastName: 'Doe' };
    await el.updateComplete;

    el.saveOrEditEmployee();

    // Onay diyaloğunun açık olduğunu kontrol ediyoruz
    const confirmDialog = el.shadowRoot.querySelector('.confirm-dialog');
    expect(confirmDialog).to.exist;
    expect(confirmDialog.textContent).to.include('Are you sure you want to edit John Doe?');
  });

  it('should proceed with edit when confirmed', async () => {
    el.employee = { id: 1, firstName: 'John', lastName: 'Doe' };
    el.showConfirmDialog = true;
    await el.updateComplete;

    const proceedButton = el.shadowRoot.querySelector('.confirm-dialog .-proceed');
    proceedButton.click();

    // Diyalog kapanmış olmalı ve düzenleme işlemi gerçekleştirilmiş olmalı
    expect(el.showConfirmDialog).to.be.false;
    const employees = JSON.parse(localStorage.getItem('employees'));
    expect(employees[0].firstName).to.equal('John');
  });

  it('should cancel edit when cancel button is clicked in the confirm dialog', async () => {
    el.employee = { id: 1, firstName: 'John', lastName: 'Doe' };
    el.showConfirmDialog = true;
    await el.updateComplete;

    const cancelButton = el.shadowRoot.querySelector('.confirm-dialog .-cancel');
    cancelButton.click();

    // Diyalog kapanmış olmalı
    expect(el.showConfirmDialog).to.be.false;
  });
});

