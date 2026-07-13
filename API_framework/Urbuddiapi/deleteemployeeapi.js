import config from "../config/config.json";
export class deleteemployee{
    constructor(request){
        this.request=request;
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