import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './ShowNotification.js';
import employeeService from '../services/employeeService.js';

class EmployeeList extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      showConfirmDialog: { type: Boolean },
      employeeToDelete: { type: Object },
      currentPage: { type: Number },
      itemsPerPage: { type: Number },
      filters: { type: Object },
      viewMode: { type: String }
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.showConfirmDialog = false;
    this.employeeToDelete = null;
    this.currentPage = 1;
    this.itemsPerPage = 5; // items per page deliberately kept low for demonstration purposes
    this.viewMode = 'table';
    this.filters = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
    window.addEventListener('resize', this.onResize);
    this.onResize(); // Check the initial window size
  }

  onResize() {
    if (window.innerWidth < 768) {
      this.viewMode = 'list';
    } else {
      this.viewMode = 'table';
    }
    this.requestUpdate();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'list' : 'table';
    this.requestUpdate();
  }

  loadEmployees() {
    this.currentPage = Number(localStorage.getItem('currentPage')) || 1;
    this.employees = employeeService.loadEmployees();
  }

  navigateToEditPage(employee) {
    Router.go(`/edit-employee:${employee.id}`);
  }

  deleteEmployee(id) {
    const employeeToDelete = this.employees.find(emp => emp.id === id);
    this.employeeToDelete = employeeToDelete;
    this.showConfirmDialog = true;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      let employees = JSON.parse(localStorage.getItem('employees')) || [];
      employees = employees.filter(emp => emp.id !== this.employeeToDelete.id);
      localStorage.setItem('employees', JSON.stringify(employees));
      this.loadEmployees();
      this.showConfirmDialog = false;

      const notification = document.createElement('notification-message');
      notification.message = 'Employee deleted successfully!';
      document.body.appendChild(notification);
    }
  }

  cancelDelete() {
    this.showConfirmDialog = false;
  }

  updateFilter(e, field) {
    this.filters = { ...this.filters, [field]: e.target.value.toLowerCase() };
  }

  get filteredEmployees() {
    return this.employees.filter(emp => {
      return Object.keys(this.filters).every(key => {
        return emp[key]?.toLowerCase().includes(this.filters[key]);
      });
    });
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  render() {
    return html`
      <div class='employee-list-title'>
        <h2>Employee List</h2>
      </div>

      <div class="employee-list-container">
        <div class='switch-button-container'>
          <button class='switch-button' @click="${this.toggleViewMode}">
          Switch to ${this.viewMode === 'table' ? 'Card View' : 'Table View'}
          </button>
        </div>
        ${this.viewMode === 'table' 
          ? this.renderTable() 
          : this.renderList()}

        ${this.showConfirmDialog
        ? html`
          <div class="overlay">
            <div class="confirm-dialog">
              <p>Are you sure you want to delete ${this.employeeToDelete?.firstName} ${this.employeeToDelete?.lastName}?</p>
              <button class="-proceed" @click="${this.confirmDelete}">Proceed</button>
              <button class="-cancel" @click="${this.cancelDelete}">Cancel</button>
            </div>
          </div>
          `
        : ''}
      </div>
    `;
  }

  // table view render
  renderTable() {
    return html`
      <table class="employee-list-table">
        <thead>
          <tr class="search-row">
            <th>
              <input
                type="text"
                @input="${e => this.updateFilter(e, 'firstName')}"
              />
            </th>
            <th>
              <input
                type="text"
                @input="${e => this.updateFilter(e, 'lastName')}"
              />
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>
              <input
                type="text"
                @input="${e => this.updateFilter(e, 'department')}"
              />
            </th>
            <th>
              <input
                type="text"
                @input="${e => this.updateFilter(e, 'position')}"
              />
            </th>
            <th></th>
          </tr>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedEmployees.length === 0
          ? html`
            <tr class="no-records">
              <td colspan="9" class="no-records-message">Employee not found.</td>
            </tr>
          `
          : this.paginatedEmployees.map(emp => html`
            <tr>
              <td class='first-name'>${emp.firstName}</td>
              <td class='last-name'>${emp.lastName}</td>
              <td class='date-of-employment'>${emp.dateOfEmployment}</td>
              <td class='date-of-birth'>${emp.dateOfBirth}</td>
              <td class='phone'>${emp.phone}</td>
              <td class='email'>${emp.email}</td>
              <td class='department'>${emp.department}</td>
              <td class='position'>${emp.position}</td>
              <td class="actions-container">
                <button class='action-button' @click="${() => this.navigateToEditPage(emp)}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M3 21h3.75L17.81 9.94l-3.75-3.75L3 17.25V21zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg></button>
                <button class='action-button' @click="${() => this.deleteEmployee(emp.id)}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg></button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>

      <div class="pagination-controls">
        <button class='prev' @click="${this.goToPreviousPage}" ?disabled="${this.currentPage === 1}">
          Previous
        </button>
        <span>Page ${this.currentPage} of ${this.totalPages}</span>
        <button class='next' @click="${this.goToNextPage}" ?disabled="${this.currentPage === this.totalPages}">
          Next
        </button>
      </div>
    `;
  }

  // card view render
  renderList() {
    return html`
      <div class="employee-list">
        ${this.employees.map(emp => html`
          <div class="employee-card">
            <h3>${emp.firstName} ${emp.lastName}</h3>
            <hr>
            <p><strong>Date of Employment:</strong> ${emp.dateOfEmployment}</p>
            <p><strong>Date of Birth:</strong> ${emp.dateOfBirth}</p>

            <p><strong>Phone:</strong> ${emp.phone}</p>
            <p><strong>Email:</strong> ${emp.email}</p>
            <p><strong>Department:</strong> ${emp.department}</p>
            <p><strong>Position:</strong> ${emp.position}</p>
            <div class="card-actions">
              <button @click="${() => this.navigateToEditPage(emp)}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M3 21h3.75L17.81 9.94l-3.75-3.75L3 17.25V21zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg></button>
              <button @click="${() => this.deleteEmployee(emp.id)}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg></button>
            </div>
          </div>
        `)}
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

  h3 {
    color: var(--primary-orange-color);
  }

.employee-list-title {
    margin: 1rem;
  }

.employee-list-container {
  overflow-x: auto;
  padding: 1rem;
  margin: 0rem 1rem;
  background-color: var(--primary-white-color);
  border-radius: 0.2rem;
}

.employee-list-container .switch-button-container {
  text-align: right;
}

.employee-list-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  min-width: 600px;
  background-color: var(--primary-white-color);
}

.employee-list-table th {
  background-color: var(--secondary-white-color);
  color: var(--primary-orange-color);
  font-weight: 400;
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem;
  white-space: nowrap;
}

.employee-list-table th input {
  display: block;
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.4rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-gray-color);
  border-radius: 4px;
  background: url('../../public/svg/search.svg') no-repeat 95% 50%;
}

.employee-list-table th input:focus {
  outline: none;
  border-color: var(--secondary-orange-color);
}

.employee-list-table th, 
.employee-list-table td {
  padding: 1rem 0.5rem;
  text-align: left;
  background-color: white;
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-list-table td {
  color: var(--secondary-gray-color);
}

.employee-list-table td.first-name,
.employee-list-table td.last-name {
  font-weight: bold;
  color: var(--primary-gray-color);
  max-width: 20rem
}

.employee-list-table tr {
  border-bottom: 1px solid var(--border-gray-color);
}

.employee-list-table td.actions-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* List View */
.employee-list {
  display: flex;
  flex-wrap: wrap;
}

.employee-card {
  background-color: var(--primary-white-color);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px;
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.employee-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.employee-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: var(--primary-orange-color);
}

.employee-card hr {
  border: 0;
  border-top: 2px solid var(--primary-orange-color);
  margin: 10px 0;
}

.employee-card p {
  margin: 8px 0;
  font-size: 14px;
  color: var(--secondary-gray-color);
}

.employee-card p strong {
  font-weight: bold;
  color: var(--primary-gray-color);
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-end;
}

.card-actions button {
  background-color: var(--primary-white-color);
  color: var(--primary-orange-color);
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card-actions button:hover {
  background-color: var(--primary-orange-color);
  color: var(--primary-white-color);
}


/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.pagination-controls button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-orange-color);
  color: var(--primary-white-color);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.pagination-controls button:hover {
  background-color: var(--primary-orange-hover-color);
  color: var(--primary-white-color);
}

.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .employee-list-table {
    grid-template-columns: repeat(3, 1fr);
  }

  .employee-list-table th,
  .employee-list-table td {
    font-size: 0.9rem;
  }

  .employee-list-container .switch-button-container {
  text-align: left;
}

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}

  button {
    background-color: var(--primary-orange-color);
    color: var(--primary-white-color);
    padding: 0.4rem 0.6rem;
    border: none;
    border-radius: 0.2rem;
    cursor: pointer;
    margin-right: 0.4rem;
    font-size: 0.875rem;
  }

  .action-button {
    background-color: var(--primary-white-color);
    color: var(--primary-orange-color);
  }

  .action-button:hover {
    background-color: var(--primary-orange-color);
    color: var(--primary-white-color);
  }


  button:hover {
    background-color: var(--primary-white-color);
    color: var(--primary-orange-color);
  }

  button.delete {
    background-color: var(--primary-button-color);
  }

  button.delete:hover {
    background-color: var(--primary-button-hover-color);
  }

  button.switch-button:hover {
    background-color: var(--primary-orange-color);
    color: var(--primary-white-color);
  }


  .no-records {
    background-color: #f8d7da;
    color: #721c24;
  }

  .no-records-message {
    text-align: center;
    padding: 1rem;
    font-weight: bold;
    font-size: 1rem;
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
}

.confirm-dialog button.-proceed:hover {
  background-color: var(--primary-orange-hover-color);
}

.confirm-dialog button.-cancel {
  background-color: rgba(255, 255, 255, 0.85);
  color: var(--primary-orange-color);
  border: 0.1rem solid var(--primary-orange-color);
}

.confirm-dialog button.-cancel:hover {
  background-color: rgba(200, 200, 200, 0.3);
  color: var(--primary-orange-hover-color);
}

  @media (max-width: 768px) {
    .employee-list-table {
    grid-template-columns: repeat(3, 1fr);
  }

  .employee-list-table th,
  .employee-list-table td {
    font-size: 0.9rem;
  }

  .employee-list-table input[type="text"] {
    font-size: 0.8rem;
  }

  .pagination-controls {
    flex-direction: row;
    align-items: flex-start;
    position: sticky;
    left: 0rem;
  }

    button {
      font-size: 0.75rem;
      padding: 0.3rem 0.5rem;
    }
  }
`;
}

customElements.define('employee-list', EmployeeList);
