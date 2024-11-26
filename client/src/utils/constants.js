export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:5173";
export const AUTH_ROUTES="http://localhost:8747/api/auth";
export const SINGNUP_ROUTE=`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES=`${AUTH_ROUTES}/login`;
export const AUDIT_ROUTES="http://localhost:8747/api/auth/audit";
export const USER_INFO="http://localhost:8747/api/auth/userinfo"
export const UPDATE_PROFILE_ROUTES=`${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE=`${AUDIT_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE=`${AUTH_ROUTES}/logout`;


export const CONTACTS_ROUTES='http://localhost:8747/api/contacts';
export const SEACRCH_CONTACTS_ROUTES=`${CONTACTS_ROUTES}/search`;