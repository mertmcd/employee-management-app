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

  goHome() {
    Router.go('/');  
  }

  render() {
    return html`
      <nav>
  <div class="left-container">
     <img @click="${this.goHome}" class="desktop-logo" src="public/assets/ing-logo.png" alt="Logo" width="100">
     <img @click="${this.goHome}" class="mobile-logo" src="public/assets/ing-logo-mobile.png" alt="Logo" width="100">
  </div>

  <div class="right-container">
    <div class="buttons-container">
      <button class='nav-button' @click="${this.addNewEmployee}">
        <img src="public/svg/add-employee.svg" alt="Add" width="20">
      Add New</button>
      <button class='nav-button' @click="${this.showEmployees}">
        <img src="public/svg/employees.svg" alt="Employees" width="20">
      Employees</button>
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
    letter-spacing: 0.05rem;
  }
  nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5rem 2rem;
    background-color: #fff; 
    color: #ff6a00;
    font-size: 16px;
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
    background-color: #fff;
    color: #ff6a00;
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
    background-color: #fff;
    color: #ff6a00;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #ff6a00;
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
      flex-direction: column;
      align-items: flex-start;
    }

    .buttons-container {
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
