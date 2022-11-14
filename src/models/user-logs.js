/**
 * @author Sameena
 *User Logs Model
 * 
 *
 */

import { BaseAPI, ApiUtils } from "soxo-bootstrap-core";


class UserLog extends BaseAPI {


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

    async getDownloadHistory(id, user) {

        const baseUrl = process.env.REACT_APP_NURA;

        return ApiUtils.get({baseUrl,

            url: `user_logs/get-download-history/${id}`,
        });
    }

}


export default UserLog;


