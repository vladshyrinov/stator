export function generateRandomType () {
    const randomString = Math.random().toString(36);
    const randomType = `DUMMY_INITIALIZER${randomString}`
    return randomType;
}

export function isObject(obj) {
    const isArray = Array.isArray(obj);
    const isObjectType = typeof obj === 'object';
    const isNull = obj === null;

    return isObjectType && !isArray && !isNull;
}