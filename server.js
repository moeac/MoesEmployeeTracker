// dependencies 
// mysql for db, inquirer for questions, clc for console styling, cTable for console tables 
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const clc = require("cli-color");
const cTable = require('console.table');
const sequelize = require('./config/connection');
const yellow = clc.yellow.bold;

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
                ]
            }
        ]
    )
    // run function depending on what user selects
    .then (selected => {
        switch (selected.options) {
            case 'View All Departments':
                viewDepartment();
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
            case 'Add anEmployee':
                addEmployee();
                break;
            case "Update an Employee's Role":
                updateEmployee();
                break;
            default:
                weDone();
        }
    });
};


init();
