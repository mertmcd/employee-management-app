import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './ShowNotification.js';
import employeeService from '../services/employeeService.js';

class EmployeeForm extends LitElement {
  static get properties() {
      return {
        employee: { type: Object },
        employees: { type: Array },
      };
    }
    
  constructor() {
    super();
    this.employee = {};
    this.employees = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
  }

  firstUpdated() {
    this.findEmployeeById();
  }

  findEmployeeById() {
    const id = parseInt(location.href.split(':').pop());
    const employee = this.employees.find(emp => emp.id === id);
    this.fillFormDataById(employee);
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

  saveOrEditEmployee() {
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

    const notification = document.createElement('notification-message');
    notification.message = this.employee.id ? 'Employee updated successfully!' : 'Employee added successfully!';
    document.body.appendChild(notification);
    
    localStorage.setItem('employees', JSON.stringify(employees));
    Router.go('/');
  }

  render() {
    return html`
      <h2>${this.employee.id ? 'Edit Employee' : 'Add New Employee'}</h2>
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
        <button type="button" @click="${this.saveOrEditEmployee}">Save</button>

      </form>
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
      color: var(--primary-orange-color);
    }

    form {
      display: grid;
      gap: 1rem;
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    input, select {
      padding: 0.8rem;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #4CAF50;
    }

    button {
      background-color: #FF6F00;
      color: white;
      border: none;
      padding: 0.8rem 1.2rem;
      font-size: 1rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #FF9800;
    }

    @media (max-width: 768px) {
      form {
        padding: 15px;
      }

      button {
        width: 100%;
      }
    }
  `;
}

customElements.define('employee-form', EmployeeForm);
