import {test, expect} from "@playwright/test";
import fs from "fs";
import { MIMEType } from "util";
import { LoginPage } from "../../API_framework/Urbuddiapi/LoginPage";
import admindata from '../../API_framework/testData/Adminlogin.json';
import config from '../../API_framework/config/config.json';
let adminToken;
test('Upload leaves',async({request})=>{
    const login = new LoginPage(request);
    adminToken=await login.getToken(admindata);
    const response=await request.post(`https://dev-api.urbuddi.com/v1/${config.adminId}/import_leaves`,{
        headers:{
            Authorization:`Bearer ${adminToken}`,
            "tenantId": `${config.tenantId}`,
        },
        multipart:{
            file:{
                name:"leave_records_T001 (27).xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                buffer: fs.readFileSync("./API_framework/testData/leave_records_T001 (27).xlsx")
            }
            }
    
    });
    const responsebody=await response.json();
    console.log(responsebody)
    //expect(responsebody.status).toBeTruthy();
    expect(responsebody.message).toBe("Leave History retrieved successfully");
    expect(responsebody.data).not.toBe(null);


});

