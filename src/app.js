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
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      { path: '/', component: 'employee-list' },
      { path: '/add-employee', component: 'employee-form' },
      { path: '/edit-employee:id', component: 'employee-form' },
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
