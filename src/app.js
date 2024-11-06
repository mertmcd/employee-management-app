import { LitElement, html } from 'lit';
import './components/EmployeeList.js';
import './components/EmployeeForm.js';
import './components/NavigationMenu.js';
import { Router } from '@vaadin/router';

class App extends LitElement {
  static properties = {
    employees: { type: Array },
    selectedEmployee: { type: Object }
  };

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployee = null;
  }

  addOrUpdateEmployee(e) {
    const employee = e.detail;
    if (employee.id) {
      this.employees = this.employees.map(emp => emp.id === employee.id ? employee : emp);
    } else {
      employee.id = Date.now();
      this.employees = [...this.employees, employee];
    }
    this.selectedEmployee = null;
    Router.go('/');
  }

  editEmployee(e) {
    this.selectedEmployee = e.detail;
    Router.go('/edit-employee');
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      { path: '/', component: 'employee-list' },
      { path: '/add-employee', component: 'employee-form' },
      { path: '/edit-employee', component: 'employee-form' },
    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <div id="outlet"></div>
    `;
  }
}

customElements.define('employee-management-app', App);
