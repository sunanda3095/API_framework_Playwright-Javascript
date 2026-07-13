import config from "../config/config.json";
export class EmployeePage{
    constructor(request){
        this.request=request;
    }
    async createEmployee(employeeData,token){
        const url=`${config.baseURL}/${config.adminId}/employee`;
        // const employeedata={
        //         ...employeeData,
        //         email,
        //         id,
        //         personal_email
        //     };
        //console.log('Create Employee URL:', url);
        //console.log('Create Employee Request Data:', employeedata);
        const response=await this.request.post(`${config.baseURL}/${config.adminId}/employee`,{
            headers:{'Content-Type':'application/json','tenantid':`${config.tenantId}`,'Authorization':`bearer ${token}`},
            data: employeeData
        
        });
        const responseBody=await response.json();
        return{
            response,
            responseBody
        };
    }
    async deleteEmployee(employeeId,token){
        const url=`${config.baseURL}/${config.adminId}/employee`;
        const employeedata={
                employee_ids:[`${employeeId}`]
            };
        console.log('Delete Employee URL:', url);
        console.log('Delete Employee Request Data:', employeedata);
        console.log('Delete Employee Token:', token);
        const response=await this.request.delete(`${config.baseURL}/${config.adminId}/employee`,{
            headers:{'Content-Type':'application/json','tenantid':`${config.tenantId}`,'Authorization':`bearer ${token}`},
            data: employeedata
        });
        const responseBody= await response.json();
        return{
            response,
            responseBody
        };
    }


}