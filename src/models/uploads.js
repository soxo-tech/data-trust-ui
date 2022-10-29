/**
 * Uploads Model
 *
 *
 * 
 *
 */


import { BaseAPI } from "soxo-bootstrap-core";

import { UploadUtils, ApiUtils } from "soxo-bootstrap-core";


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

    /**
     * Function to upload the zip file. The file is send to backend, a summary is created in uploads,upload details and user logs
     * The file is uploaded to Azure blob storage
     * @param {*} file 
     * @param {*} analysisResult 
     * @returns 
     */
    uploadFileContent = (file, analysisResult) => {
        if (analysisResult)
            //To upload Analysis Result
            return UploadUtils('uploads/upload-analysis-file', file)
        else
            //To upload Check up and Consent
            return UploadUtils('uploads/upload-file', file)
    };

    /**
     * Function to Update consent 
     * @param {*} file 
     * @param {*} analysisResult 
     * @returns 
     */
     updateConsent = (file) => {
       
            //To upload Check up and Consent
            return UploadUtils('uploads/update-consent', file)
    };


       /**
     * Function to Update consent 
     * @param {*} file 
     * @param {*} analysisResult 
     * @returns 
     */


        getData = (analysisResult) => {

            var mode,baseUrl

            if (analysisResult){
                mode = 'ANALYSIS';
                baseUrl = process.env.REACT_APP_FF;
            }
    
            //for checkup data download details use nura database
            else{
                mode = 'CHECKUP';
                baseUrl = process.env.REACT_APP_NURA;
            }

        
       
            //To upload Check up and Consent
            return ApiUtils.get({baseUrl,url:`uploads/get-data/${mode}`})
    };


    /**
     * Function to download check up and analysis files. This function is used for both bulk and individual downloads
     * @param {*} id 
     * @param {*} analysisResult 
     * @param {*} bulk 
     * @returns 
     */
    downloadFiles = (id, analysisResult, bulk) => {

        var mode
        let baseUrl = null;
        
        //For analysis result download details use FF database
        if (analysisResult){
            mode = 'ANALYSIS';
            baseUrl = process.env.REACT_APP_FF;
        }

        //for checkup data download details use nura database
        else{
            mode = 'CHECKUP';
            baseUrl = process.env.REACT_APP_NURA;
        }

        return ApiUtils.get({baseUrl,
            url: `uploads/download?bulk=${bulk}&id=${id}&mode=${mode}`,
        });


    };

    /**
     * Download the buffer array from backend
     * @param {*} data 
     * @returns 
     */
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


