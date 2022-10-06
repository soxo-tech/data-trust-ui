/**
 *User Logs Model
 *
 *
 *
 *
 */

 import {BaseAPI} from "@soxo/bootstrap-core";
 
 
 class UserLog extends BaseAPI{
       
 
           get id() {
                     return 'id';
           }
 
           get getEndpoint() {
                     return 'user_logs';
           }
 
           get path() {
                     return `user_logs`;
           }
 
           get modelName() {
                     return `UserLogs`;
           }
 
 }
 
 
 export default UserLog;
 
 
 