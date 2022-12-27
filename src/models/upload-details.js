/**
 * 
 * @auhtor Sameena 
 * Upload Details Model
 *
 */

import moment from 'moment'
import { BaseAPI, ApiUtils } from "soxo-bootstrap-core";


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

    /**
     * Get data from upload_details
     * @param {*} uploadId 
     * @param {*} analysisResult 
     * @returns 
     */

    getDetails(uploadId, analysisResult) {

        let baseUrl = null;

        //For Analysis Result load data from FF database
        if (analysisResult)
            baseUrl = process.env.REACT_APP_FF
        //Else load data from Nura database 
        else
            baseUrl = process.env.REACT_APP_NURA
            
        return ApiUtils.get({ baseUrl, url: `upload_details/get-details/${uploadId}` })


    }


    /**
     * Get data from upload_details  within a range
     * @param {*} uploadId 
     * @param {*} analysisResult 
     * @returns 
     */

    getUploadDetails(range) {

        const start_time = moment(range[0]).format('MM/DD/YYYY');

        const end_time = moment(range[1]).format('MM/DD/YYYY');

        let baseUrl = null;

        // load data from Nura database 
        baseUrl = process.env.REACT_APP_NURA

        return ApiUtils.get({ baseUrl, url: `upload_details/get-upload-details?upload_start_date=${start_time}&upload_end_date=${end_time}` })


    }





    /**
     * Get consent data
     * @param {*} nuraId 
     * @returns 
     */

    getConsent(nuraId) {
        //Get Consent data from Nura database
        var baseUrl = process.env.REACT_APP_NURA

        return ApiUtils.get({ baseUrl,url: `upload_details/get-consent/${nuraId}` })

    }


    /**
    * Get derived analysis data
    * @param {*} nuraId 
    * @returns 
    */

    loadDetails(nuraId) {
        //Get Derived Analysis Result from FF database
        var baseUrl = process.env.REACT_APP_FF

        return ApiUtils.get({ baseUrl, url: `upload_details/load-details/${nuraId}` })

    }


    /**
   * Discard Consent
   * @param {*} nuraId 
   * @returns 
   */

    discard(id, user) {

        var formBody = {
            discarded_date: moment(),
            discarded_by: user.id
        }
        //Get Derived Analysis Result from FF database
        var baseUrl = process.env.REACT_APP_NURA

        return ApiUtils.put({ baseUrl, url: `upload_details/discard/${id}`, formBody })

    }


    /**
    * Function to delete a record
    * @param {*} id 
    * @returns 
    */

    deleteRecord(id) {

        var baseUrl = process.env.REACT_APP_FF

        return ApiUtils.get({ baseUrl, url: `upload_details/delete-record/${id}` })
    }

}


export default UploadDetail;


