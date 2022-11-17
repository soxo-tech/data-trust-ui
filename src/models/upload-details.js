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


