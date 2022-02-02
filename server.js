// dependencies 
// mysql for db, inquirer for questions, clc for console styling, cTable for console tables 
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const clc = require("cli-color");
const cTable = require('console.table');
const db = require('./config/connection');
const yellow = clc.yellow.bold;
const green = clc.green.bold;
const red = clc.red.bold;

// initialise with the corny banner and run menu
const init = () => {
    console.log(yellow("=============================================="))
    console.log(yellow("==             EMPLOYEE TRACKER             =="))
    console.log(yellow("=============================================="))
    menu();
};

// menu options
const menu = async () => {
    await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'menu',
                message: 'What you wana do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    "Update an Employee's Role",
                    "I'm done"
                ],
                loop: false,
            }
        ]
    )
    // run function depending on what user selects
    .then (selected => {
        switch (selected.menu) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case "Update an Employee's Role":
                updateEmployeeRole();
                break;
            default:
                weDone();
        }
    });
};

// logs all departments 
const viewDepartments = async () => {
    const [rows] = await db.promise().query('SELECT * FROM department');
    console.log("\n" + cTable.getTable(rows));
    menu();
};
//  logs all roles
const viewRoles = async () => {
    const [rows] = await db.promise().query('SELECT * FROM role');
    console.log("\n" + cTable.getTable(rows));
    menu();
};
// logs all employees
const viewEmployees = async () => {
    const [rows] = await db.promise().query('SELECT * FROM employee');
    console.log("\n" + cTable.getTable(rows));
    menu();
};
// adds a departments
const addDepartment = async () => {
    // inquirer prompts user input
    await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'new_department',
                message: "What's the name of the new Department?"
            },
            {
                type: 'input',
                name: 'new_department_id',
                message: "What's the ID of the new Department?",
                // validate numbersOnly function defined @line 227
                validate: numbersOnly
            }
        ]
    )
    // logs success and inserts new department into db then logs all departments
    .then((response) => {
        console.log(green.bgBlackBright("\nNEW DEPARTMENT ADDED! GOOD JOB"))
        console.log(green("\n" + cTable.getTable(response)));
        db.query('INSERT INTO department (id, name) VALUES (?, ?)',
        [response.new_department_id, response.new_department]);  
    });
    viewDepartments();
};

// adds a new role
const addRole = async () => {
    // inquirer prompts user input with integer validation
    await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'new_role',
                message: "What's the new role?"
            },
            {
                type: 'input',
                name: 'new_role_salary',
                message: "How much coin they getting?",
                validate: numbersOnly
            },
            {
                type: 'input',
                name: 'department_id',
                message: "What's the department ID associated with this role?",
                validate: numbersOnly 
            }
        ]
    ) 
    // logs success, inserts new role into db and logs all roles
    .then((response) => {
        console.log(green.bgBlackBright("\nNEW ROLE ADDED! WOW INCREDIBLE"))
        console.log(green("\n" + cTable.getTable(response)));
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [response.new_role, response.new_role_salary, response.department_id]);  
    });
    viewRoles();
};

// adds new employee
const addEmployee = async () => {
    // inquirer prompts user input with some validation
    await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'new_employee_first_name',
                message: "What's the first name",
                // validate lettersOnly function defined @line 244
                validate: lettersOnly
            },
            {
                type: 'input',
                name: 'new_employee_last_name',
                message: "What's the last name?",
                validate: lettersOnly
            },
            {
                type: 'input',
                name: 'role_id',
                message: "What's the role ID they'll be assigned?",
                validate: numbersOnly 
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "What's the ID of the manager they report to",
                validate: numbersOnly 
            }
        ]
    )
    // logs success and inserts new employee to db and logs all employees
    .then((response) => {
        console.log(green.bgBlackBright("\nNEW EMPLOYEE ADDED! SO BEAUTIFUL"))
        console.log(green("\n" + cTable.getTable(response)));
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [response.new_employee_first_name, response.new_employee_last_name, response.role_id, response.manager_id]);  
    });
    viewEmployees();
};

// updates an employee role
const updateEmployeeRole = async () => {
    // retrieves employees from db, maps them and returns them with their full name and id
    var [employees] = await db.promise().query('SELECT * FROM employee');
    employees = employees.map((employee) => {
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        };
    });
    // retrieves roles from db, maps them and returns them with their title and id
    var [roles] = await db.promise().query('SELECT * FROM role');
    roles = roles.map((role) => {
        return {
            name: `${role.title}`,
            value: role.id
        };
    });
    // inquirer prompts user for input and uses employee and role data we just sourced from the db as options for choices
    await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'selected_employee',
                message: 'Select employee to update role',
                choices: employees
            },
            {
                type: 'list',
                name: 'selected_new_role',
                message: 'Select what role they get',
                choices: roles
            }
        ]
    )
    // logs success and updates employee role, then logs all employees
    .then((response) => {
        console.log(green.bgBlackBright("\nEMPLOYEE ROLE UPDATED! THANK YOU"))
        console.log(green("\n" + cTable.getTable(response)));
        db.query('UPDATE employee SET ? WHERE ?',
        [{role_id: response.selected_new_role}, {id: response.selected_employee}])
    });
    viewEmployees();
}

// numbers only validation
const numbersOnly = (response) => {
    const numbers = /^[0-9]+$/;
    if (!numbers.test(String(response))) {
        console.log(red("\npls put a number, we dont do letters around here"));
        return false;
    } else {
        return true;
    }
};

// letters only validation, please name your children wisely
const lettersOnly = (response) => {
    const letters = /^[A-Za-z]+$/;
    if (!letters.test(String(response))) {
        console.log(red("\npls put a normal name in with letters and none of that weird shit like X Æ A-Xii, Anfrony, Sirinyti or Jaxon. If your child has one of these names, you have failed as a human being."));
        return false;
    } else {
        return true;
    }
};

// end the app
const weDone = () => {
    return console.log(yellow("==============================================\n==             EMPLOYEES TRACKED            ==\n=============================================="));
}

// begin the app
init();
