test.describe.configure({ mode: 'serial' });
import {test,expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
let adminemail="judos@gmail.com";
let adminpassword="abcdef";
let adminid="emo123";
let token;
let employee_token;
let employeeid=`${faker.number.int({ min: 1000, max: 9999 })}emo`;
let employeeemail=`emo${faker.internet.email()}`;
let password="abcdef";
let leaveId;
test.beforeAll(async({request})=>{ 
    const response=await request.post('https://dev-api.urbuddi.com/v1/authentication',
    {headers:{'content-type':"application/json"},
    data:{
      "email": `${adminemail}`, 
      "password": `${adminpassword}`,
      "device_token": "",
      "domain_name": "optimworks"
    }
    });
    const responsebody= await response.json();
    token = responsebody.token;
    console.log("login as admin");
    console.log(responsebody);
    console.log(response.status());
    console.log(response.statusText());
    console.log(token);

    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    expect(response.json()).not.toBeNull;
    
})

test('Creating employee',async({request})=>{
    const response= await request.post('https://dev-api.urbuddi.com/v1/emo123/employee',{
        headers:{'Content-Type':'application/json','tenantid':'T001','Authorization':`bearer ${token}`},
        data:{
            
                "address": "hyd",
                "blood_group": "O+",
                "date_of_birth": "2026-07-02",
                "department": "cse",
                "designation": "trainee",
                "email": `${employeeemail}`,
                "first_name": "Sdsfdf",
                "gender": "Male",
                "id":`${employeeid}`,
                "joining_date": "2026-07-08",
                "last_name": "Sdsfdf",
                "mobile_number": "8989898989",
                "password": `${password}`,
                "past_experience": "2",
                "personal_email": `personal${Date.now()}@gmail.com`,
                "qualifications": "Degree",
                "reporting_to": "when@gmail.com",
                "role": "Employee",
                "salary": "30000",
                "uan_number": ""

        }
    })
    let responsebody= await response.json();
    console.log("Creating employee");
    console.log(response.status());
    console.log(response.statusText());
    console.log(await response.json());
    console.log(employeeemail);
    console.log(employeeid);
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    expect(responsebody).not.toBeNull;
    expect(responsebody.message).toBe('success');
})

test('employee login',async({request})=>{
    const response= await request.post('https://dev-api.urbuddi.com/v1/authentication',{
        headers:{'Content-Type':'application/json'},
        data:{
            "email": `${employeeemail}`,
            "password": `${password}`,
            "device_token": "",
            "domain_name": "optimworks"
        }
    });
    console.log("employee login");
    console.log(employeeemail);
    console.log(password);
    const responsebody= await response.json();
    employee_token = responsebody.token;
    console.log(employee_token);
    console.log(response.status());
    console.log(response.statusText());
    console.log(await response.json());
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    expect(responsebody).not.toBeNull;
    expect(responsebody.token).not.toBeNull;
})
test('employee leave request',async({request})=>{
    let url=`https://dev-api.urbuddi.com/v1/${employeeid}/leave`;
    console.log(url);
    const response= await request.post(`https://dev-api.urbuddi.com/v1/${employeeid}/leave`,{
        headers:{'Content-Type':'application/json','tenantid':'T001','Authorization':`bearer ${employee_token}`},
        data:{ "days": 1,
                "employee_email": `${employeeemail}`,
                "employee_id": `${employeeid}`,
                "end_date": "2026-07-26",
                "hr_email": "judos@gmail.com",
                "leave_reason": "asdfdaf",
                "request_type": "Leave",
                "start_date": "2026-07-26",
                "status": "Awaiting",
                "subject": "describe"            
            }
    });
    const responsebody=await response.json();
    console.log("employee leave request");
    console.log(responsebody);
    console.log(response.status());
    console.log(response.statusText());
    console.log(responsebody.data);
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    expect(responsebody).not.toBeNull();
    expect(responsebody.data).not.toBeNull();
    expect(responsebody.message).toBe('Leave inserted successfully');
})
test('get all leaves and find leave id by employee id',async({request})=>{
    const response=await request.get(`https://dev-api.urbuddi.com/v1/${adminid}/pending_leaves?start_month=2026-07&end_month=2026-07`,{
        headers:{'Content-Type':'application/json','tenantid':'T001','Authorization':`bearer ${token}`}
    });
    const responsebody=await response.json();
    console.log("get all leaves");
    console.log(response.status());
    console.log(response.statusText());
    console.log(responsebody);
    const leave = responsebody.data.find(l => l.employee_id === employeeid && l.status === 'Awaiting');
    leaveId = leave.leave_id;
    console.log("Found Leave ID:", leaveId);
    expect(response.status()).toBe(200);
    expect(responsebody).not.toBeNull();
    expect(leaveId).not.toBeNull();
})
test('approving leave request',async({request})=>{
    const response=await request.put(`https://dev-api.urbuddi.com/v1/${adminid}/leave/${leaveId}`,{
        headers:{'Content-Type':'application/json','tenantid':'T001','Authorization':`bearer ${token}`},
        data:{
            'status': "Approved",
            'rejected_reason': ""
        }
        }
    );
    const responsebody=await response.json();
    console.log("approving leave request");
    console.log(response.status());
    console.log(response.statusText());
    console.log(responsebody);
    expect(response.status()).toBe(200);
    expect(responsebody).not.toBeNull();
    expect(responsebody.message).toBe('Leave Status updated successfully');
    expect(responsebody.status).toBe(true);
})
test('delete employee',async({request})=>{
    const response=await request.delete(`https://dev-api.urbuddi.com/v1/${adminid}/employee`,{
        headers:{'Content-Type':'application/json','tenantid':'T001','Authorization':`bearer ${token}`},
        data:{
            "employee_ids":[`${employeeid}`]
        }
    });
    const responsebody=await response.json();
    console.log("delete employee");
    console.log(response.status());
    console.log(response.statusText());
    console.log(responsebody);
    console.log(employeeid);
    expect(response.status()).toBe(200);
    expect(responsebody).not.toBeNull();
    expect(responsebody.message).toBe('success');
});
