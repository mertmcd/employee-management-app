import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './ShowNotification.js';
import employeeService from '../services/employeeService.js';

class EmployeeForm extends LitElement {
  static get properties() {
    return {
      employee: { type: Object },
      employees: { type: Array },
      showConfirmDialog: { type: Boolean },
      employeeToEdit: { type: Object },
    };
  }

  constructor() {
    super();
    this.employee = {};
    this.employees = [];
    this.showConfirmDialog = false;
    this.employeeToEdit = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
  }

  firstUpdated() {
    this.findEmployeeById();
  }

  findEmployeeById() {
    const url = window.location.pathname;
    const id = url.split('/').pop();
    if (id) {
      const employee = this.employees.find(emp => emp.id == id);
      this.fillFormDataById(employee);
    }
  }

  fillFormDataById(employee) {
    if (employee) {
      this.employee = employee;
      const form = this.shadowRoot.querySelector('form');
      for (const key in employee) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = employee[key];
        }
      }
    }
  }

  loadEmployees() {
    this.employees = employeeService.loadEmployees();
  }

  validateForm() {
    const form = this.shadowRoot.querySelector('form');
    const firstName = form.querySelector('[name="firstName"]').value;
    const lastName = form.querySelector('[name="lastName"]').value;
    const dateOfEmployment = form.querySelector('[name="dateOfEmployment"]').value;
    const dateOfBirth = form.querySelector('[name="dateOfBirth"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const email = form.querySelector('[name="email"]').value;

    if (!firstName || firstName.length < 2) {
      this.showFieldNotification('First Name must be at least 2 characters.', 'error');
      return false;
    }

    if (!lastName || lastName.length < 2) {
      this.showFieldNotification('Last Name must be at least 2 characters.', 'error');
      return false;
    }

    if (!dateOfEmployment || isNaN(Date.parse(dateOfEmployment))) {
      this.showFieldNotification('Please provide a valid Date of Employment.', 'error');
      return false;
    }

    if (!dateOfBirth || isNaN(Date.parse(dateOfBirth))) {
      this.showFieldNotification('Please provide a valid Date of Birth.', 'error');
      return false;
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      this.showFieldNotification('Phone must be a 10-digit number.', 'error');
      return false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showFieldNotification('Please provide a valid email address.', 'error');
      return false;
    }

    return true;
  }

  showFieldNotification(message, type = 'success') {
    const notification = document.createElement('notification-message');
    notification.message = message;
    notification.type = type;
    document.body.appendChild(notification);
  }

  openConfirmDialog() {
    this.showConfirmDialog = true;
  }

  confirmEdit() {
    this.showConfirmDialog = false;
    this.performSaveOrEdit();
  }

  cancelEdit() {
    this.showConfirmDialog = false;
  }

  saveOrEditEmployee() {
    if (!this.validateForm()) {
      return;
    }
    
    if (this.employee.id) {
      this.openConfirmDialog();
    } else {
      this.performSaveOrEdit();
    }
  }

  performSaveOrEdit() {
    const form = this.shadowRoot.querySelector('form');
    const formData = new FormData(form);

    const employee = {
      id: this.employee.id || Date.now(),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfEmployment: formData.get('dateOfEmployment'),
      dateOfBirth: formData.get('dateOfBirth'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      department: formData.get('department'),
      position: formData.get('position'),
    };

    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    if (this.employee.id) {
      employees = employees.map(emp => emp.id === employee.id ? employee : emp);
    } else {
      employees.push(employee);
    }

    this.showFieldNotification('Employee saved successfully!', 'success');

    localStorage.setItem('employees', JSON.stringify(employees));
    Router.go('/');
  }

  render() {
    return html`
    <div class='employee-form-title'>
      <h2>${this.employee.id ? 'Edit Employee' : 'Add New Employee'}</h2>
    </div>
    <div class='employee-form-container'>
      <form>
        <label>First Name: <input name="firstName" type="text" .value="${this.employee.firstName || ''}"></label>
        <label>Last Name: <input name="lastName" type="text" .value="${this.employee.lastName || ''}"></label>
        <label>Date of Employment: <input name="dateOfEmployment" type="date" .value="${this.employee.dateOfEmployment || ''}"></label>
        <label>Date of Birth: <input name="dateOfBirth" type="date" .value="${this.employee.dateOfBirth || ''}"></label>
        <label>Phone: <input name="phone" type="text" .value="${this.employee.phone || ''}"></label>
        <label>Email: <input name="email" type="email" .value="${this.employee.email || ''}"></label>
        <label>Department: 
          <select name="department">
            <option value="Analytics" ?selected="${this.employee.department === 'Analytics'}">Analytics</option>
            <option value="Tech" ?selected="${this.employee.department === 'Tech'}">Tech</option>
          </select>
        </label>
        <label>Position: 
          <select name="position">
            <option value="Junior" ?selected="${this.employee.position === 'Junior'}">Junior</option>
            <option value="Medior" ?selected="${this.employee.position === 'Medior'}">Medior</option>
            <option value="Senior" ?selected="${this.employee.position === 'Senior'}">Senior</option>
          </select>
        </label>
        
      </form>
      <div class='save-button'>
        <button type="button" @click="${this.saveOrEditEmployee}">Save</button>
      </div>

      ${this.showConfirmDialog
        ? html`
          <div class="overlay">
            <div class="confirm-dialog">
              <p>Are you sure you want to edit <strong>${this.employee.firstName} ${this.employee.lastName}</strong>?</p>
              <button class="-proceed" @click="${this.confirmEdit}">Proceed</button>
              <button class="-cancel" @click="${this.cancelEdit}">Cancel</button>
            </div>
          </div>
          `
        : ''}
    </div>
    `;
  }

  static styles = css`
* {
  margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

h2 {
  text-align: left;
    color : var(--primary-orange-color);
    font-weight: 400;
}

.employee-form-title {
  margin: 1rem;
  text-align: center;
}

.employee-form-container {
  overflow-x: auto;
  padding: 1rem;
  margin: 0rem auto;
  background-color: var(--primary-white-color);
  border-radius: 0.2rem;
  width: 50%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);

}

form {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  grid-template-columns: repeat(2, 1fr); /* İki sütunlu grid */
  grid-template-rows: auto; /* Yükseklik otomatik */
}

label {
  font-weight: 600;
  font-size: 1rem;
  color: var(--primary-orange-color);
  margin-bottom: 0.5rem;
  display: block;
}

input, select {
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0em.875rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  width: 100%;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-orange-color);
  background-color: #fff;
}

button {
  background-color: var(--primary-orange-color);
  color: white;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

button:hover {
  background-color: var(--primary-orange-hover-color);
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.save-button {
  grid-column: span 2;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.15);
  max-width: 90%;
  width: 400px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.confirm-dialog p {
  margin-bottom: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-dialog button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 0.3rem;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
}

.confirm-dialog button:hover {
  transform: scale(1.05);
}

.confirm-dialog button.-proceed {
  background-color: var(--primary-orange-color);
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  width: auto;
}

.confirm-dialog button.-proceed:hover {
  background-color: var(--primary-orange-hover-color);
}

.confirm-dialog button.-cancel {
  background-color: rgba(255, 255, 255, 0.85);
  color: var(--primary-orange-color);
  border: 0.1rem solid var(--primary-orange-color);
  padding: 0.4rem 0.6rem;
  width: auto;
}

.confirm-dialog button.-cancel:hover {
  background-color: rgba(200, 200, 200, 0.3);
  color: var(--primary-orange-hover-color);
}

@media (max-width: 768px) {
  .employee-form-container {
    width: 95vw;

  }

  .save-button {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 90%;
    background-color: var(--main-bg-color);
    z-index: 1000;
    margin: 1rem;
    display: flex;
  }

  form {
    padding: 0rem;
  }

  button {
    width: 100%;
  }

  label {
    font-size: 0.875rem;
  }

}

  `;
}

customElements.define('employee-form', EmployeeForm);
