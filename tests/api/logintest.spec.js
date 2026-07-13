import { test, expect } from "@playwright/test";
import { LoginPage } from "../../API_framework/Urbuddiapi/LoginPage.js";
import adminData from "../../API_framework/testData/Adminlogin.json";
let adminToken;

test("Admin Login", async ({ request }) => {

    const loginPage = new LoginPage(request);

    const {response, responseBody} = await loginPage.login(adminData);


    expect(response.status()).toBe(200);

    expect(responseBody.token).toBeTruthy();
    adminToken = responseBody.token;

    console.log("Admin Token:", responseBody.token);
    console.log("AdminEmail:", adminData.email);
    console.log("AdminId:",adminData.id);    
});