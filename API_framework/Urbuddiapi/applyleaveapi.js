import config from '../config/config.json';
import {expect} from '@playwright/test';
export class LeavePage{
  constructor(request){
    this.request=request;
  }
  async applyleave(leavedata,token,employeeId,employeeEmail){
    const requestBody = {
        ...leavedata,
        employee_email: employeeEmail,
        employee_id: employeeId
    };

    const response = await this.request.post(
            `${config.baseURL}/${employeeId}/leave`,
            {
                headers:{'Content-Type':'application/json',
                         'tenantid':`${config.tenantId}`,
                         'Authorization':`bearer ${token}`
                        },
                data:requestBody
            }
        );
        const responseBody = await response.json();

            return {
                response,
                responseBody
            };
    }
    async approveleave(token,leaveId){
        const requestbody={'status': "Approved",
            'rejected_reason': ""
        }
        
        const response=await this. request.put(`${config.baseURL}./${config.adminId}/leave/${leaveId}`,{
        headers:{'Content-Type':'application/json','tenantid':`${config.tenantId}`,'Authorization':`bearer ${token}`},
        data:requestbody
        });

        const responseBody = await response.json();

            return {
                response,
                responseBody
            };
    }
    
}