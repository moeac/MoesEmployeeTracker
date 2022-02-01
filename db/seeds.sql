INSERT INTO department (name)
VALUES  ("Health"),
        ("Transport"),
        ("Education"),
        ("Justice");

INSERT INTO role (title, salary, department_id)
VALUES  ("Minister for Aged Care", 1000000, 1),
        ("Minister for Mental Health", 1000000, 1),
        ("Chief Executive Officer", 1000000, 2),
        ("Director of Infrastructure", 1000000, 2),
        ("Minister for Education", 1000000, 3),
        ("Assistant Minister for Youth", 1000000, 3),
        ("Minister for Electoral Affairs", 5000000, 4),
        ("Minister for Mines", 5000000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("NotEven", "ADoctor", 1, NULL),
        ("AlsoNot", "ADoctor", 2, 1),
        ("NotEven", "AnEngineer", 3, NULL),
        ("AlsoNot", "AnEngineer", 4, 3),
        ("NotEven", "ATeacher", 5, NULL),
        ("AlsoNot", "ATeacher", 6, 5),
        ("Criminal", "PigLawyer", 7, NULL),
        ("DestroysLand", "ForMoney", 8, 7);
