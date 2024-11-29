export const HTTP_CODE = Object.freeze({
    BAD_REQUEST: 400,
    TOKEN_INVALID: 401,
    FORBIDDEN: 403,
    SUCCESS : 200,
    NOT_FOUND : 404,
    REQUEST_TIMEOUT : 408,
    INTERNAL_SERVER_ERROR : 500
})

export const TOAST_TYPES = Object.freeze({
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
});

export const AuthStatuses = Object.freeze({
    UNAUTHENTICATED: 0,
    FORBIDDEN:1,
    LOGGING_IN: 2,
    LOGIN_SUCCESS: 3,
    TOKEN_EXPIRED: 4,
    UNVERIFIED: 5,
    INCOMPLETE_PROFILE: 6,
    UNDER_REVIEW: 7,
});