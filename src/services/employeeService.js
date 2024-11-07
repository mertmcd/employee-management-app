const loadEmployees = () => {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    return employees;
  };

  export default { loadEmployees };