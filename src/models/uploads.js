/**
 * Uploads Model
 *
 *
 * 
 *
 */


import { BaseAPI } from "@soxo/bootstrap-core";

import {ApiUtils} from "@soxo/bootstrap-core";


class Upload extends BaseAPI {


          get id() {
                    return 'id';
          }

          get getEndpoint() {
                    return 'uploads';
          }

          get path() {
                    return `uploads`;
          }

          get modelName() {
                    return `Uploads`;
          }




}


export default Upload;

