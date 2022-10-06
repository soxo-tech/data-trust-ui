/**
 * Upload Details Model
 *
 *
 *
 *
 */

 import {BaseAPI} from "@soxo/bootstrap-core";
 
 
 class UploadDetail extends BaseAPI{
       
 
           get id() {
                     return 'id';
           }
 
           get getEndpoint() {
                     return 'upload_details';
           }
 
           get path() {
                     return `upload_details`;
           }
 
           get modelName() {
                     return `UploadDetails`;
           }
 
 }
 
 
 export default UploadDetail;
 
 
 