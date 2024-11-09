import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import {setLocale} from '../services/localization.js';
class NavigationMenu extends LitElement {

  constructor() {
    super();
    this.languages = {
      en: 'English',
      tr: 'Türkçe'
    };
    this.selectedLanguage = 'en';
    updateWhenLocaleChanges(this);
  }

  changeLanguage(e) {
    this.selectedLanguage = e.target.value;
    document.documentElement.lang = this.selectedLanguage;
    setLocale(this.selectedLanguage);
  }

  addNewEmployee() {
    Router.go('/add-employee');
  }

  showEmployees() {
    Router.go('/');
  }

  goHome() {
    Router.go('/');
  
  }

  render() {
    return html`
      <nav>
  <div class="left-container">
     <img @click="${this.goHome}" class="desktop-logo" src="public/assets/ing-logo.png" alt="Logo" width="100">
     <img @click="${this.goHome}" class="mobile-logo" src="public/assets/ing-logo-mobile.png" alt="Logo" width="70">
  </div>

  <div class="right-container">
  <div class="buttons-container">
  <button class="nav-button" @click="${this.addNewEmployee}">
    <img src="public/svg/add-employee.svg" alt="Add" width="20">
    <span class="button-text">${msg('Add Employee')}</span>
  </button>
  <button class="nav-button" @click="${this.showEmployees}">
    <img src="public/svg/employees.svg" alt="Employees" width="20">
    <span class="button-text">${msg('Employees')}</span>
  </button>
</div>

    <div class="language-selector">
            <select @change="${this.changeLanguage}">
              <option value="en" ?selected="${this.selectedLanguage === 'en'}">English</option>
              <option value="tr" ?selected="${this.selectedLanguage === 'tr'}">Türkçe</option>
            </select>
    </div>
  </div>
</nav>
    `;
  }

  static styles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
  }
  nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5rem 2rem;
    background-color: var(--primary-white-color); 
    color: var(--primary-orange-color);
    font-size: 1rem;
  }

  nav .left-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 1;
  }

  nav .left-container img {
    cursor: pointer;
  }

  nav .right-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  button {
    background-color: var(--primary-white-color);
    color: var(--primary-orange-color);
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s ease;
    font-size: 14px;
  }

  button.nav-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }


  select {
    background-color: var(--primary-white-color);
    color: var(--primary-orange-color);
    padding: 5px;
    font-size: 14px;
    border: 1px solid var(--primary-orange-color);
  }

  .buttons-container {
    display: flex;
    gap: 10px;
  }

  .left-container .mobile-logo {
  display: none;
}

.left-container .desktop-logo {
  display: block;
}

  @media (max-width: 768px) {
    nav {
      flex-direction: row;
      align-items: flex-start;
      padding: 0;
    }

    .right-container {
      align-self: center;
      margin-right: 1rem;
    }

    .button-text {
    display: none;
    }

    .buttons-container {
      flex-direction: row;
      gap: 8px;
    }

    button {
      width: 100%;
      font-size: 1rem;
      padding: 0;
    }

    select {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }

    .left-container .desktop-logo {
      display: none;
    }
    .left-container .mobile-logo {
      display: block;
    }
  }
`;
}

customElements.define('navigation-menu', NavigationMenu);
