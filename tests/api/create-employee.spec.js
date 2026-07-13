import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import { EmployeePage } from '../../API_framework/Urbuddiapi/createemployeeapi.js';
import employeeData from '../../API_framework/testData/EmployeeData.json';
import admindata from '../../API_framework/testData/Adminlogin.json';
import { LoginPage } from '../../API_framework/Urbuddiapi/LoginPage.js';
import{deleteemployee} from '../../API_framework/Urbuddiapi/deleteemployeeapi.js'
//import data, { getEmployeeData } from '../../API_framework/utils/employeedatabuilder.js'
import {buildData,clearGeneratedValues} from '../../API_framework/utils/dynamicdatagenerator.js';
import employeeTemplate from '../../API_framework/testData/EmployeeData.json';
let employeeToken;
let adminToken;
let employee_email;
let employeeid;
let data;
test.beforeAll(async ({ request }) => {
  const login = new LoginPage(request);
  clearGeneratedValues();
  
  //Login as admin to get the token 
  const response = await login.login(admindata);
  adminToken =await  login.getToken(admindata);
  console.log('Admin Token:', adminToken);
});

test('Create Employee', async ({request}) => {
    const employeePage = new EmployeePage(request);
    data = buildData(employeeTemplate);

    // //Dynamic data generation for employee email and id
    // employee_email=`emo${faker.internet.email()}`;
    // employeeid=`${faker.number.int({ min: 1000, max: 9999 })}emo`;
    // const employeepersonal_email=`personal${Date.now()}@gmail.com`;
    
    //Employee creation 
    //empdata=getEmployeeData();
    console.log(data);
    const result = await employeePage.createEmployee(data, adminToken);
    console.log( result.responseBody);
    expect(result.response.status()).toBe(200);
    expect(result.responseBody.message).toBe('success');
    
});

test.afterAll(async ({ request }) => {
    const employeedelete = new deleteemployee(request);
    const resultget=await employeedelete.deleteEmployee(data.id,adminToken);
    console.log('Delete employee response body:', resultget.responseBody);
    expect(resultget.response.status()).toBe(200);
    expect(resultget.responseBody.message).toBe('success');
});
