

const originalLocalStorageGet = localStorage.getItem;
const originalLocalStorageSet = localStorage.setItem;
const originalLocalStorageRemove = localStorage.removeItem;
const originalSessionStorageGet = sessionStorage.getItem;
const originalSessionStorageSet = sessionStorage.setItem;
const originalSessionStorageRemove = sessionStorage.removeItem;


export function getLocalStorageItem(key) {
    if (!originalLocalStorageGet) return null;
    let result = null;
    try {
        result = originalLocalStorageGet.call(window.localStorage, key);
    } catch (error) {
        console.error(
            'LocalStorage get error for key ',
            key,
            ' Error: ',
            error
        );
    }

    return result;
}

export function setLocalStorageItem(key, value) {
    if (!originalLocalStorageSet) return;

    try {
        originalLocalStorageSet.call(window.localStorage, key, value);
    } catch (error) {
        console.error(
            'LocalStorage set error for key ',
            key,
            ' Error: ',
            error
        );
    }
}

export function removeLocalStorageItem(key) {
    if (!originalLocalStorageRemove) return;

    try {
        originalLocalStorageRemove.call(window.localStorage, key);
    } catch (error) {
        console.error(
            'LocalStorage remove error for key ',
            key,
            ' Error: ',
            error
        );
    }
}

export function getSessionStorageItem(key) {
    if (!originalSessionStorageGet) return null;

    let result = null;
    try {
        result = originalSessionStorageGet.call(window.sessionStorage, key);
    } catch (error) {
        console.error(
            'SessionStorage get error for key ',
            key,
            ' Error: ',
            error
        );
    }

    return result;
}

export function setSessionStorageItem(key, value) {
    if (!originalSessionStorageSet) return;

    try {
        originalSessionStorageSet.call(window.sessionStorage, key, value);
    } catch (error) {
        console.error(
            'SessionStorage set error for key ',
            key,
            ' Error: ',
            error
        );
    }
}

export function removeSessionStorageItem(key) {
    if (!originalSessionStorageRemove) return;

    try {
        originalSessionStorageRemove.call(window.sessionStorage, key);
    } catch (error) {
        console.error(
            'SessionStorage remove error for key ',
            key,
            ' Error: ',
            3
        );
    }
}
