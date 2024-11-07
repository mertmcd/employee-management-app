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
      filters: { type: Object }
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.showConfirmDialog = false;
    this.employeeToDelete = null;
    this.currentPage = 1;
    this.itemsPerPage = 5; // items per page deliberately kept low for demonstration purposes
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
  }

  loadEmployees() {
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
      <div class="employee-list-container">
        <table class="employee-list-table">
        <thead>
  <tr>
    <th>First Name
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'firstName')}"
        placeholder="Search"
      />
    </th>
    <th>Last Name
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'lastName')}"
        placeholder="Search"
      />
    </th>
    <th>Date of Employment
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'dateOfEmployment')}"
        placeholder="Search"
      />
    </th>
    <th>Date of Birth
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'dateOfBirth')}"
        placeholder="Search"
      />
    </th>
    <th>Phone
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'phone')}"
        placeholder="Search"
      />
    </th>
    <th>Email
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'email')}"
        placeholder="Search"
      />
    </th>
    <th>Department
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'department')}"
        placeholder="Search"
      />
    </th>
    <th>Position
      <input
        type="text"
        @input="${e => this.updateFilter(e, 'position')}"
        placeholder="Search"
      />
    </th>
    <th>Actions</th>
  </tr>
</thead>

          <tbody>
            ${this.paginatedEmployees.length === 0 
              ? html`
                  <tr class="no-records">
                    <td colspan="9" class="no-records-message">Employee not found</td>
                  </tr>
                ` 
              : this.paginatedEmployees.map(emp => html`
                  <tr>
                    <td>${emp.firstName}</td>
                    <td>${emp.lastName}</td>
                    <td>${emp.dateOfEmployment}</td>
                    <td>${emp.dateOfBirth}</td>
                    <td>${emp.phone}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>${emp.position}</td>
                    <td class="actions-container">
                      <button @click="${() => this.navigateToEditPage(emp)}">Edit</button>
                      <button @click="${() => this.deleteEmployee(emp.id)}">Delete</button>
                    </td>
                  </tr>
                `)}
          </tbody>
        </table>
  
        <div class="pagination-controls">
          <button @click="${this.goToPreviousPage}" ?disabled="${this.currentPage === 1}">
            Previous
          </button>
          <span>Page ${this.currentPage} of ${this.totalPages}</span>
          <button @click="${this.goToNextPage}" ?disabled="${this.currentPage === this.totalPages}">
            Next
          </button>
        </div>
        ${this.showConfirmDialog
          ? html`
            <div class="confirm-dialog">
              <p>Are you sure you want to delete ${this.employeeToDelete?.firstName} ${this.employeeToDelete?.lastName}?</p>
              <button class="-proceed" @click="${this.confirmDelete}">Proceed</button>
              <button class="-cancel" @click="${this.cancelDelete}">Cancel</button>
            </div>
          `
          : ''
        }
      </div>
    `;
  }
  
  static styles = css`

    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }

    .pagination-controls button {
      background-color: #ff6a00;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 0 10px;
      font-size: 14px;
    }

    .pagination-controls button[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .employee-list-container {
      padding: 20px;
      background-color: #fff;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .employee-list-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .employee-list-table th, .employee-list-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      max-width: 120px;
    }

    .employee-list-table td.actions-container {
      display: flex;
      justify-content: center;
    }

    .employee-list-table th {
      background-color: #ff6a00;
      color: white;
    }

    .employee-list-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    button {
      background-color: #ff6a00;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
      font-size: 14px;
    }

    button:hover {
      background-color: #e65b00;
    }

    button.delete {
      background-color: #d9534f;
    }

    button.delete:hover {
      background-color: #c9302c;
    }

    .no-records {
      background-color: #f8d7da;
      color: #721c24;
    }

    .no-records-message {
      text-align: center;
      padding: 20px;
      font-weight: bold;
      font-size: 16px;
    }

    .confirm-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border: 2px solid #ccc;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .confirm-dialog button {
      margin: 5px;
      background-color: white;
      border: 1px solid #ccc;
      font-family: Arial, Helvetica, sans-serif;
    }

    .confirm-dialog button.-proceed {
        background-color: #ff6a00;
        color: white;
    }

    .confirm-dialog button.-proceed:hover {
        background-color: #e65b00;
    }


    .confirm-dialog button.-cancel {
        background-color: white;
        color: #ff6a00;
        border: 1px solid #ff6a00;
    }

    .confirm-dialog button.-cancel:hover {
        background-color: #ccc;
    }

    @media (max-width: 768px) {
      .employee-list-container {
        padding: 15px;
        width: 90%;
      }

      .employee-list-table th, .employee-list-table td {
        padding: 8px;
      }

      button {
        font-size: 12px;
        padding: 6px 10px;
      }
    }
  `;
}

customElements.define('employee-list', EmployeeList);
