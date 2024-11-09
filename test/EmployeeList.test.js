import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import { EmployeeList } from  '../src/components/EmployeeList.js';
    
    suite('EmployeeList', () => {
        let element;

        setup(async () => {
            element = await fixture(html`<employee-list></employee-list>`);
        });

        test('is defined', () => {
            assert.instanceOf(element, EmployeeList);
        });

        test('has default properties', () => {
            assert.deepEqual(element.employees, []);
            assert.isFalse(element.showConfirmDialog);
            assert.isNull(element.employeeToDelete);
            assert.equal(element.currentPage, 1);
            assert.equal(element.itemsPerPage, 5);
            assert.equal(element.viewMode, 'table');
            assert.deepEqual(element.filters, {
                firstName: '',
                lastName: '',
                dateOfEmployment: '',
                dateOfBirth: '',
                phone: '',
                email: '',
                department: '',
                position: '',
            });
        });

        test('toggles view mode', () => {
            element.toggleViewMode();
            assert.equal(element.viewMode, 'list');
            element.toggleViewMode();
            assert.equal(element.viewMode, 'table');
        });

        test('updates filters', () => {
            const event = { target: { value: 'John' } };
            element.updateFilter(event, 'firstName');
            assert.equal(element.filters.firstName, 'john');
        });

        test('opens delete dialog', () => {
            element.employees = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
            element.openDeleteDialog(1);
            assert.isTrue(element.showConfirmDialog);
            assert.deepEqual(element.employeeToDelete, { id: 1, firstName: 'John', lastName: 'Doe' });
        });

        test('cancels delete', () => {
            element.showConfirmDialog = true;
            element.cancelDelete();
            assert.isFalse(element.showConfirmDialog);
        });

        test('handles popstate', () => {
            const url = new URL(window.location.href);
            url.searchParams.set('page', '2');
            window.history.pushState({}, '', url);
            element._handlePopstate();
            assert.equal(element.currentPage, 2);
        });

        test('handles resize', () => {
            window.innerWidth = 500;
            element._handleResize();
            assert.equal(element.viewMode, 'list');
            window.innerWidth = 800;
            element._handleResize();
            assert.equal(element.viewMode, 'table');
        });

        test('loads employees', () => {
            const employees = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
            localStorage.setItem('employees', JSON.stringify(employees));
            element.loadEmployees();
            assert.deepEqual(element.employees, employees);
        });

        test('confirms delete', () => {
            const employees = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
            localStorage.setItem('employees', JSON.stringify(employees));
            element.employees = employees;
            element.employeeToDelete = { id: 1, firstName: 'John', lastName: 'Doe' };
            element.confirmDelete();
            assert.deepEqual(element.employees, []);
            assert.isFalse(element.showConfirmDialog);
        });

        test('pagination controls', () => {
            element.goToNextPage();
            assert.equal(element.currentPage, 2);
            element.goToPreviousPage();
            assert.equal(element.currentPage, 1);
        });
    });
