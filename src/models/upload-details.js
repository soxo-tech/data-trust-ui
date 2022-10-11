/**
 * Upload Details Model
 *
 *
 *
 *
 */

import { BaseAPI,ApiUtils } from "sx-bootstrap-core";


class UploadDetail extends BaseAPI {


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

    getDetails(uploadId) {

        return ApiUtils.get({url:`upload_details/get-details/${uploadId}`})

    }

    getConsent(nuraId) {

        return ApiUtils.get({url:`upload_details/get-consent/${nuraId}`})

    }

    loadDetails(nuraId) {

        return ApiUtils.get({url:`upload_details/load-details/${nuraId}`})

    }

}


export default UploadDetail;


