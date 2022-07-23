export = {
    //normal consts
    OK: 200,
    LIMIT_MOST_USED_TAGS: 3,
    PAGINATION_TAKE: 20,
    LOCAL: 'local',

    //sens
    SENS_DEFAULT: '[ex-it!]',
    SMS: 'SMS',
    FROM_PHONE_NUMBER: '01090204201',

    //for testing purposes
    LOCAL_URL: 'https://ex-it.app/health',
    KAKAO: 'kakao',
    KAKAO_URL: "https://kapi.kakao.com/v1/user/access_token_info",
    
    NAVER: 'naver',
    NAVER_URL: "https://openapi.naver.com/v1/nid/me",
    
    FACEBOOK: 'facebook',
    FACEBOOK_URL: "https://graph.facebook.com/me",

    OAUTH_ACCESS_TOKEN: 'oauth_access_token',
    OAUTH_REFRESH_TOKEN: 'oauth_refresh_token',
    REFRESH_TOKEN: 'refresh_token',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN_HEADER: 'Refresh-Token',

    //jwt
    JWT_ACCESS_TOKEN_EXP: '30m',
    JWT_REFRESH_TOKEN_EXP: '14d',
    ONE_DAY_IN_SECONDS: 24*60*60,
    JWT_EXPIRED: 'jwt expired',

    //Error handling messages
    TARGET_NOT_EXIST: 'target has no match in database',
    JWT_NOT_EXIST: 'no access_token exists',
    INVALID_JWT: 'invalid jwt token',
    BAD_REFRESH_TOKEN: 'refresh token not match',
    INVALID_OAUTH_TOKEN: 'invalid oauth access token',
    UNHANDLED_EXCEPTION: 'something wrong',
    OAUTH_CANT_CHANGE_PW: 'oauth users cant change password!',
    PASSWORD_NOT_MATCH: 'password does not match',
    TOO_MANY_TRIES: 'too many loops',
    DATABASE_CREATE_FAILED: 'insert failed',
    DATABASE_ERROR: 'typeorm error',
    NO_RESPONSE: 'no response recieved',
    EXISTS: 'target exists in database',
    QUERY_FAILED: 'query failed',
    INSERT_FAILED: 'insert query failed',
    UPDATE_FAILED: 'update failed',
    UNAUTHORIZED_USER: 'unauthorized access',
    BAD_REQUEST: 'bad request',
    DUPLICATE_ACCOUNT_ERROR: 'this account is already signed in',
    SERVER_ERROR: 'server error',
    NOT_FOUND: '404 Not Found',
    ALREADY_OCCUPIED: 'room already occupied',
    SENS_RESPONSE_ERROR: 'http response error',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    //Error codes
    SIGNIN_ERROR_CODE: 1,
    LOCAL_STRATEGY_ERROR_CODE: 2,
    JWT_STRATEGY_ERROR_CODE: 3,
    OAUTH_VALIDATE_ERROR_CODE: 4,
    LOGOUT_ERROR_CODE: 5,
    LOGIN_ERROR_CODE: 6,
    CHANGE_PW_ERROR_CODE: 7,
    REMOVE_LOCAL_REFRESH_TOKEN_CODE: 8,
    FINDUSER_ERROR_CODE: 9,
    FIND_BY_EMAIL_ERROR_CODE: 10,
    VALIDATE_USER_ERROR_CODE: 11,
    UPDATE_BY_EMAIL_ERROR_CODE: 12,
    FIND_USER_ERROR: 13,
    UPDATE_ERROR_CODE: 14,
    REMOVE_ERROR_CODE: 15,
    GET_RANDOM_NICKNAME_ERROR_CODE: 16,
    USER_CREATE_ERROR_CODE: 17,
    FIND_IF_USER_EXISTS_ERROR_CODE: 18,
    AUTH_CREATE_FAILED_ERROR_CODE: 19,
    COMPARE_REFRESH_TOKENS_ERROR_CODE: 20,
    UPDATE_LOCAL_REFRESH_TOKEN_ERROR_CODE: 21,
    UPDATE_OAUTH_REFRESH_TOKEN_ERROR_CODE: 22,
    GET_SETTING_INFO_ERROR_CODE: 23,
    GET_MY_INFO_ERROR_CODE: 24,
    GET_MY_ACCOUNT_ERROR_CODE: 25,
    GET_ALARM_INFO_ERROR_CODE: 26,
    GET_CHATTIME_INFO_ERROR_CODE: 27,
    GET_MAIN_TAGS_ERROR_CODE: 28,
    GET_TOPICS_ERROR_CODE: 29,
    GET_ALL_ROOMS_ERROR_CODE: 30,
    CREATE_ROOM_ERROR_CODE: 31,
    SAVE_ROOM_TAGS_ERROR_CODE: 32,
    JOIN_ROOM_ERROR_CODE: 33,
    GET_USER_INFO_ERROR_CODE: 34,
    GET_USER_ID_ERROR_CODE: 35,
    FIND_ROOM_ERROR_CODE: 36,
    CREATE_REVIEW_ERROR_CODE: 37,
    FIND_ROOM_USER: 38,
    CHECK_OCCUPIED_ERROR_CODE: 39,
    UPDATE_ROOM_JOIN_ERROR_CODE: 40,
    PASSWORD_NOT_MATCH_CODE: 41,
    CHECK_EMAIL_ERROR_CODE: 42,
    UPDATE_ROOM_ONLINE_ERROR_CODE: 43,
    GET_USERID_FROM_STATUS_ERROR_CODE: 44,
    SEND_MESSAGE_ERROR_CODE: 45,
    VERIFY_REQUEST_ERR_CODE: 46
}