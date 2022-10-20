/**
 * Uploads Model
 *
 *
 * 
 *
 */


import { BaseAPI } from "soxo-bootstrap-core";

import { UploadUtils, ApiUtils } from "sx-bootstrap-core";


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


    downloadFiles = (id, analysisResult,bulk) => {
        if (bulk)
            if (analysisResult)
                return ApiUtils.get({
                    url: `uploads/download?bulk=true&id=${id}&mode=ANALYSIS`,
                });
            else
                return ApiUtils.get({
                    url: `uploads/download?bulk=true&id=${id}&mode=CHECKUP`,
                });
        else
            if (analysisResult)
                return ApiUtils.get({
                    url: `uploads/download?id=${id}&mode=ANALYSIS`,
                });
            else
                return ApiUtils.get({
                    url: `uploads/download?id=${id}&mode=CHECKUP`,
                });

    };

    download = (data) => {
        var bytearray = Object.keys(data);
        var arrayelement = Object.values(data);
        var uint8Array = new Uint8Array(bytearray.length);

        for (var i = 0; i < uint8Array.length; i++) {

            uint8Array[i] = arrayelement[i];
        }


        for (var i = 0; i < bytearray; i++) {
            var ascii = arrayelement.charCodeAt(i);
            uint8Array[i] = ascii;
        }
        var arrBuffer = uint8Array;
        var newBlob = new Blob([arrBuffer], { type: 'json' });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        // setBtnLoading(false);
        var res
        res = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = res;
        link.download = 'newfile.json';
        link.click();
        window.URL.revokeObjectURL(res);
        link.remove();
    }


}


export default Upload;


