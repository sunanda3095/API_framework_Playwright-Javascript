import {test, expect} from "@playwright/test";
import fs from "fs";
import { MIMEType } from "util";
import { LoginPage } from "../../API_framework/Urbuddiapi/LoginPage";
import admindata from '../../API_framework/testData/Adminlogin.json';
import config from '../../API_framework/config/config.json';
let adminToken;
test('Export Employees',async({request})=>{
    const login = new LoginPage(request);
    adminToken=await login.getToken(admindata);
    const response=await request.get(`https://dev-api.urbuddi.com/v1/${config.adminId}/export_employees?status=Released`,{
        headers:{
            Authorization:`Bearer ${adminToken}`,
            "tenantId": `${config.tenantId}`,
        },
       
    
    });
    const fileBuffer = await response.body();

    fs.writeFileSync(
        "../APIPLAYWRIGHT/API_framework/testData/Employees.xlsx",
        fileBuffer
    );
    console.log(fileBuffer);
    expect(response.status()).toBe(200);
    expect(fs.existsSync("../APIPLAYWRIGHT/API_framework/testData/Employees.xlsx")).toBeTruthy();

});

