import { LitElement, html, css } from 'lit';
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
      { path: '/employees', component: 'employee-list' },
      { path: '/add-employee', component: 'employee-form' },
      { path: '/edit-employee/:id', component: 'employee-form' },

    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <div id="outlet"></div>
    `;
  }

  static styles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
  }

  body, html {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  :host {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    --main-bg-color: #f3f3f3;
    --primary--black-color: #000;
    --secondary-black-color: #333;
    --primary-white-color: #ffffff;
    --secondary-white-color: #f3f3f3;
    --primary-gray-color: #505050;
    --secondary-gray-color: #616161;
    --primary-orange-color: #ff6a00;
    --secondary-orange-color: #ffbe80;
    --primary-orange-hover-color: #c45f00;
    --primary-button-color: #d1d1d1;
    --primary-button-hover-color: #e1e1e1;
    --border-gray-color: #d1d1d1;
    --border-orange-color: #ff6a00;
  }

  navigation-menu {
    color: var(--primary-white-color);
  }

  #outlet {
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    background-color: var(--main-bg-color);
  }

  @media (max-width: 768px) {
    #outlet {
      padding: 0;
    }
  }
`;
}

customElements.define('employee-management-app', App);
