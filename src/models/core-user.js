/**
 *User Logs Model
 *
 *
 *
 *
 */

import { BaseAPI } from "soxo-bootstrap-core";


class CoreUser extends BaseAPI {


    get id() {
        return 'id';
    }

    get getEndpoint() {
        return 'users';
    }

    get path() {
        return `users`;
    }

    get modelName() {
        return `UsersModule`;
    }

}


export default CoreUser;


