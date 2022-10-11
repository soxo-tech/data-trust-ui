/**
 * Uploads Model
 *
 *
 * 
 *
 */


import { BaseAPI } from "sx-bootstrap-core";

import { ApiUtils } from "sx-bootstrap-core";


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


