import {test,expect} from '@playwright/test';
import {LeavePage} from '../../API_framework/Urbuddiapi/applyleaveapi.js';
import { EmployeePage } from '../../API_framework/Urbuddiapi/createemployeeapi.js';
import {faker} from '@faker-js/faker';
import admindata from '../../API_framework/testData/Adminlogin.json';
import leavedata from '../../API_framework/testData/LeaveData.json';
import { LoginPage } from '../../API_framework/Urbuddiapi/LoginPage.js';
import { getEmployeeleaveIdPage } from '../../API_framework/Urbuddiapi/getemployeeeleaveidapi.js';
import {  approveLeavePage } from '../../API_framework/Urbuddiapi/approveleaveapi.js';
import {buildData,clearGeneratedValues} from '../../API_framework/utils/dynamicdatagenerator.js';
import employeeTemplate from '../../API_framework/testData/EmployeeData.json';
import employeeloginTemplate from '../../API_framework/testData/employeelogin.json';
let adminToken;
let employee_email;
let employeeid;
let employee_token;
let leaveid;
let create_emp_data;
let emp_login_data;

test.beforeAll(async({request})=>{
    clearGeneratedValues();
     const login = new LoginPage(request);
    //Login as admin to get the token 
    const response = await login.login(admindata);
    adminToken =await login.getToken(admindata);
    console.log('Admin Token:', adminToken);


    const employeePage=new EmployeePage(request); 
    create_emp_data = buildData(employeeTemplate);
    emp_login_data=buildData(employeeloginTemplate)

    console.log(create_emp_data); 
    //Dynamic data generation for employee email and id
    // employee_email=`emo${faker.internet.email()}`;
    // employeeid=`${faker.number.int({ min: 1000, max: 9999 })}emo`;
    // const employeepersonal_email=`personal${Date.now()}@gmail.com`;
    //Employee creation
    const result = await employeePage.createEmployee(create_emp_data, adminToken);
    console.log('Create employee response body:', result.responseBody);
    expect(result.response.status()).toBe(200);
    expect(result.responseBody.message).toBe('success');

    //employee token
    employee_token=await login.getToken(emp_login_data);
    console.log(employee_token);




})
test('Apply leave and approve Leave',async({request})=>{
    const leavePage=new LeavePage(request);
    const employeeleaveId=new getEmployeeleaveIdPage(request);
    const approveleave=new  approveLeavePage(request);
    const response=await leavePage.applyleave(leavedata,employee_token,create_emp_data.id,create_emp_data.email);
    console.log('Apply leave response body:',response.responseBody);
    expect(response.response.status()).toBe(200);
    expect(response.responseBody.message).toBe('Leave inserted successfully');

    //get leave id
    leaveid=await employeeleaveId.getLeaveId(adminToken,create_emp_data.id);
    const aprroveleaveResponse=await approveleave.approveleave(adminToken,leaveid);

})

test.afterAll(async({request},testInfo)=>{
    if (testInfo.status === "passed") {
    const employeePage=new EmployeePage(request);
    const resultget=await employeePage.deleteEmployee(create_emp_data.id,adminToken);
    console.log('Delete employee response body:', resultget.responseBody);
    expect(resultget.response.status()).toBe(200);
    expect(resultget.responseBody.message).toBe('success');
    }
})
