import config from '../config/config.json';
import {expect} from '@playwright/test';
export class getEmployeeleaveIdPage{
  constructor(request){
    this.request=request;
  }
    async getLeaveId(token,employeeid){
         const response=await this.request.get(`${config.baseURL}/${config.adminId}/pending_leaves?start_month=2026-07&end_month=2026-07`,{
        headers:{'Content-Type':'application/json','tenantid':`${config.tenantId}`,'Authorization':`bearer ${token}`}
    });
    const responsebody=await response.json();
        console.log("get all leaves");
        console.log(responsebody);
        const leave = responsebody.data.find(l => l.employee_id === employeeid && l.status === 'Awaiting');
        const leaveId = leave.leave_id;
        console.log("Found Leave ID:", leaveId);
        expect(response.status()).toBe(200);
        expect(responsebody).not.toBeNull();
        expect(leaveId).not.toBeNull();
        return leaveId;

    }
}