/**
 * Uploads Model
 *
 *
 * 
 *
 */


import { BaseAPI } from "sx-bootstrap-core";

import { UploadUtils } from "sx-bootstrap-core";


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

    uploadFileContent = (file, analysisResult) => {
        if (analysisResult)
            return UploadUtils('uploads/upload-analysis-file', file)
        else
            return UploadUtils('uploads/upload-file', file)
    };


}


export default Upload;


