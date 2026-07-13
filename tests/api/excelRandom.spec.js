import { test, expect } from "@playwright/test";

import { readExcel } from "../../API_framework/utils/excelReader.js";
import { buildRequest } from "../../API_framework/utils/excelDataBuilder.js";

import employeeTemplate from "../../API_framework/testData/EmployeeData.json";
import adminData from "../../API_framework/testData/Adminlogin.json";

import { EmployeePage } from "../../API_framework/Urbuddiapi/createemployeeapi.js";
import { LoginPage } from "../../API_framework/Urbuddiapi/LoginPage.js";
import {clearGeneratedValues} from "../../API_framework/utils/dynamicdatagenerator.js";
import { deleteemployee } from "../../API_framework/Urbuddiapi/deleteemployeeapi.js";
const excelData = readExcel(
        "C:/Users/admin/APIplaywright/API_framework/testData/TestData.xlsx",
        "employeelogin"
    );

let adminToken;
let createdEmployees = [];

test.beforeAll(async ({ request }) => {

    const login = new LoginPage(request);

    const response = await login.login(adminData);

    adminToken = response.responseBody.token;

});

for (const row of excelData) {

    if (row.Execute !== "Yes") continue;

    test(`${row.TC_ID} - Create Employee`, async ({ request }) => {

        clearGeneratedValues();

        const employeePage = new EmployeePage(request);

        console.log("Running :", row.TC_ID);

        const data = JSON.parse(row.Data);

        const requestBody = buildRequest(
            employeeTemplate,
            data
        );

        console.log(requestBody);

        const result = await employeePage.createEmployee(
            requestBody,
            adminToken
        );

        console.log(result.responseBody);

        const expectedResponse = JSON.parse(row.ExpectedResponse);

        expect(result.response.status()).toBe(
            Number(row.ExpectedStatus)
        );

        expect(result.responseBody).toMatchObject(expectedResponse);

        if (result.response.status() === 200) {
            createdEmployees.push(requestBody.id);
        }

    });

}
test.afterAll(async ({ request }) => {

    const deletePage = new deleteemployee(request);

    for (const employeeId of createdEmployees) {

        const response = await deletePage.deleteEmployee(
            employeeId,
            adminToken
        );

        console.log(`Deleted ${employeeId}`, response.responseBody);

        expect(response.response.status()).toBe(200);
        expect(response.responseBody.message).toBe("success");
    }
});