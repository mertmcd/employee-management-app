import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';


class NavigationMenu extends LitElement {

  constructor() {
    super();
    this.languages = {
      en: 'English',
      tr: 'Türkçe'
    };
    this.selectedLanguage = 'en';
  }

  changeLanguage(e) {
    this.selectedLanguage = e.target.value;
    document.documentElement.lang = this.selectedLanguage;
  }

  addNewEmployee() {
    Router.go('/add-employee');
  }

  showEmployees() {
    Router.go('/');
  }

  render() {
    return html`
      <nav>
        <div class="logo">
            <img src="public/assets/ing-logo.png" alt="Logo" width="100">
        </div>

        <div class="button-container">
          <button @click="${this.addNewEmployee}">Add New Employee</button>
          <button @click="${this.showEmployees}">Employees</button>
        </div>
        <select @change="${this.changeLanguage}">
          <option value="en" ?selected="${this.selectedLanguage === 'en'}">English</option>
          <option value="tr" ?selected="${this.selectedLanguage === 'tr'}">Türkçe</option>
        </select>
      </nav>
    `;
  }

  static styles = css`
  * {
    font-family: Arial, Helvetica, sans-serif;
  }
  nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1rem;
    background-color: #fff; 
    color: #ff6a00;
    font-size: 16px;
  }

  button {
    background-color: #fff;
    color: #ff6a00;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s ease;
    font-size: 14px;
  }

  button:hover {
    background-color: #e65b00;
  }

  select {
    background-color: #ff6a00;
    color: white;
    border: 1px solid #fff;
    padding: 5px;
    font-size: 14px;
  }

  .button-container {
    display: flex;
    gap: 10px;
  }

  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      align-items: flex-start;
    }

    .button-container {
      flex-direction: column;
      gap: 8px;
    }

    button {
      width: 100%;
      padding: 12px;
      font-size: 16px;
    }

    select {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }
  }
`;
}

customElements.define('navigation-menu', NavigationMenu);
