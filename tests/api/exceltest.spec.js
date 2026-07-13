import { test, expect } from "@playwright/test";

import { readExcel } from "../../API_framework/utils/excelReader.js";
import { buildRequest } from "../../API_framework/utils/excelDataBuilder.js";

import employeeTemplate from "../../API_framework/testData/EmployeeData.json";
import adminData from "../../API_framework/testData/Adminlogin.json";

import { EmployeePage } from "../../API_framework/Urbuddiapi/createemployeeapi.js";
import { LoginPage } from "../../API_framework/Urbuddiapi/LoginPage.js";
import {clearGeneratedValues} from "../../API_framework/utils/dynamicdatagenerator.js";
import { deleteemployee } from "../../API_framework/Urbuddiapi/deleteemployeeapi.js";


let adminToken;
let createdEmployees = [];
let results;

test.beforeAll(async ({ request }) => {

    const login = new LoginPage(request);

    const response = await login.login(adminData);

    adminToken = response.responseBody.token;

});

test("Create Employee - Excel Data Driven", async ({ request }) => {

    const employeePage = new EmployeePage(request);
    const failures = [];

    const excelData = readExcel(
        "C:/Users/admin/APIplaywright/API_framework/testData/TestData.xlsx",
        "employeelogin"
    );


    for (const row of excelData) {

        if (row.Execute !== "Yes") continue;

        let result;

        try {

            clearGeneratedValues();

            const data = JSON.parse(row.Data);

            const requestBody = buildRequest(employeeTemplate, data);

            result = await employeePage.createEmployee(
                requestBody,
                adminToken
            );

            const expectedResponse = JSON.parse(row.ExpectedResponse);

            expect(result.response.status()).toBe(Number(row.ExpectedStatus));
            expect(result.responseBody).toMatchObject(expectedResponse);

            if (result.response.status() === 200) {
                createdEmployees.push(requestBody.id);
            }

        } catch (error) {

            failures.push({
                TC_ID: row.TC_ID,
                ExpectedStatus: row.ExpectedStatus,
                ActualStatus: result?.response?.status(),
                ExpectedResponse: row.ExpectedResponse,
                ActualResponse: JSON.stringify(result?.responseBody),
            });

        }
    }
    if (failures.length > 0) {

    console.log(failures);

    throw new Error(`${failures.length} test case(s) failed`);

}
});
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