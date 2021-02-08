/**
 * Converts JSON object to FormData
 *
 * @param {type} data
 * @param key
 * @param formData
 * @returns {FormData}
 */
export const _buildFormData = (data, key, formData) => {
    if (!formData) {
        formData = new FormData();
    }
    if ( ((typeof(data) === 'object') && (data !== null)) || Array.isArray(data) ) {
        for (var i in data) {
            var _key = (key ? key + '[' + i + ']' : i);
            if ( ((typeof(data[i]) === 'object') && (data[i] !== null)) || Array.isArray(data[i]) ) {
                this._buildFormData(data[i], _key, formData);
            } else {
                formData.append(_key, data[i]);
            }
        }
    } else {
        formData.append(key, data);
    }
    return formData;
}


/**
 * Returns default data used for most API requests, as FormData object
 *
 * @returns {FormData}
 */
export const _defaultData = (withCredentials, additionalData) => {
    // Define default data
    const data = {
        deviceId: '',
        timezone: '',
        token: '',
        appbuild: '1',
        ...additionalData
    };

    // Add credentials, if requested
    if (withCredentials) {
        data.username = '';
        data.password = '';
    }

    // Convert to FormData
    return this._buildFormData(data);
}