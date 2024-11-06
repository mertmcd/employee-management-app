import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

class EmployeeForm extends LitElement {
    static get properties() {
        return {
          employee: { type: Object },
        };
      }
    
      constructor() {
        super();
        this.employee = {};
      }

      connectedCallback() {
        super.connectedCallback();
        this.addEventListener('edit-employee', (event) => {
          this.employee = { ...event.detail };
        });
      }

      saveEmployee() {
        const formData = new FormData(this.shadowRoot.querySelector('form'));
        const employeeData = {};
        formData.forEach((value, key) => {
          employeeData[key] = value;
        });
        
        let employees = JSON.parse(localStorage.getItem('employees')) || [];
      
        if (this.employee.id) {
          employeeData.id = this.employee.id;
          employees = employees.map(emp => emp.id === this.employee.id ? employeeData : emp);
        } else {
          employeeData.id = Date.now();
          employees.push(employeeData);
        }
      
        localStorage.setItem('employees', JSON.stringify(employees));
      
        this.dispatchEvent(new CustomEvent('save-employee', { detail: employeeData }));
      
        this.employee = {};
      
        this.showSuccessMessage();

        Router.go('/');
      }
      

  showSuccessMessage() {
    const message = document.createElement('div');
    message.textContent = 'Your employee record has been saved successfully!';
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000';
    message.style.fontWeight = 'bold';
    
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  render() {
    return html`
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
        <button type="button" @click="${this.saveEmployee}">Save Employee</button>
      </form>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f4f9;
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
