import config from '../config/config.json';
import {expect} from '@playwright/test';
export class approveLeavePage{
        constructor(request){
            this.request=request;
        }
    async approveleave(token,leaveId){
        const requestbody={
            'status': "Approved",
            'rejected_reason': ""
        }
        
        const response=await this.request.put(`${config.baseURL}/${config.adminId}/leave/${leaveId}`,{
        headers:{'Content-Type':'application/json','tenantid':`${config.tenantId}`,'Authorization':`bearer ${token}`},
        data:requestbody
        });
        console.log("approving leave request");
        console.log(response.status());
        console.log(response.statusText());
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody).not.toBeNull();
        expect(responseBody.message).toBe('Leave Status updated successfully');
        expect(responseBody.status).toBe(true);


            return {
                response,
                responseBody
            };
    }
    
}