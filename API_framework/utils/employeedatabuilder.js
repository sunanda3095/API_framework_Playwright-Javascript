import employeeTemplate from "../testData/EmployeeData.json";
import { faker } from "@faker-js/faker";

export function getEmployeeData() {

    const data = JSON.parse(JSON.stringify(employeeTemplate));

    if (employeeData.email === "{{EMAIL}}") {
    employeeData.email = `emo${faker.internet.email()}`;
}

if (employeeData.id === "{{EMPLOYEE_ID}}") {
    employeeData.id = `${faker.number.int({ min: 1000, max: 9999 })}emo`;
}

if (employeeData.personal_email === "{{PERSONAL_EMAIL}}") {
    employeeData.personal_email = `personal${Date.now()}@gmail.com`;
}

    return data;
}