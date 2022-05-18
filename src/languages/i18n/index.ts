export const BAD_REQUEST = 'BAD_REQUEST';

export const AUTH = {
    FIND_USER_FAIL: "FIND_USER_FAIL",
    REGISTER: {
        DUPLICATE: 'AUTH.REGISTER.DUPLICATE',
        EXIST: 'AUTH.REGISTER.EXIST',
        SUCCESS: 'AUTH.REGISTER.SUCCESS',
    },
    LOGIN: {
        INVALID: {
            INDEX: 'AUTH.LOGIN.INVALID.INDEX',
            USERNAME_EMAIL: 'AUTH.LOGIN.INVALID.USERNAME_EMAIL',
            PASSWORD: 'AUTH.LOGIN.INVALID.PASSWORD',
        },
        SUCCESS: 'AUTH.LOGIN.SUCCESS',
    },
};

export const POST = {
    CREATE_POST_SUCCESS: 'POST.CREATE_POST_SUCCESS',
    FIND_POST_FAIL: 'POST.FIND_POST_FAIL',
    UPDATE_POST_SUCCESS: 'POST.UPDATE_POST_SUCCESS',
    DELETE_POST_SUCCESS: 'POST.DELETE_POST_SUCCESS',
    LIKE_POST_SUCCESS: 'POST.LIKE_POST_SUCCESS',
    UNLIKE_POST_SUCCESS: 'POST.UNLIKE_POST_SUCCESS',
    COMMENT_POST_SUCCESS: 'POST.COMMENT_POST_SUCCESS',
    FIND_COMMENT_FAIL: 'POST.FIND_COMMENT_FAIL',
    UPDATE_COMMENT_SUCCESS: 'POST.UPDATE_COMMENT_SUCCESS',
    DELETE_COMMENT_POST_SUCCESS: 'POST.DELETE_COMMENT_POST_SUCCESS',
    DELETE_COMMENT_POST_FAIL: 'POST.DELETE_COMMENT_POST_FAIL',
    LIKE_COMMENT_SUCCESS: 'POST.LIKE_COMMENT_SUCCESS',
    UNLIKE_COMMENT_SUCCESS: 'POST.UNLIKE_COMMENT_SUCCESS',
    REPLY_COMMENT_SUCCESS: 'POST.REPLY_COMMENT_SUCCESS',
};

export const POST_SHARE = {
    CREATE_POST_SHARE_SUCCESS: 'POST_SHARE.CREATE_POST_SHARE_SUCCESS',
};
