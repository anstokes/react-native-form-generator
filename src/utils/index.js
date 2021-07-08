/**
 * Function ensures that any objects with the keys "function" or "regex" are converted to either Function or RegExp.
 * Modifies the objects in the given array.
 * 
 * @param {Array} dataArray 
 */
 export const ensureFunctionAndRegex = (dataArray) => {
    if (Array.isArray(dataArray)) {
        dataArray.forEach((elem, index) => {
            // Find the element which has the regex object
            if (Array.isArray(elem)) {
                elem.forEach((nestedElem, nestedIndex) => {
                    // Check if string value starts with / and ends with /, if so convert from string to regex
                    if (typeof nestedElem === 'object') {
                        let keys = Object.keys(nestedElem);

                        if (keys.length) {
                            // Convert to function from object
                            if (keys.includes('function')) {
                                let args = dataArray[index][nestedIndex].function.args;
                                let body = dataArray[index][nestedIndex].function.body;
                                
                                if (args && body) {
                                    dataArray[index][nestedIndex] = new Function(args, body);
                                }
                                else {
                                    dataArray.splice(index, 1);
                                }
                            }
                            else if (keys.includes('regex')) {
                                let value = dataArray[index][nestedIndex].regex.value;
                                let flag = dataArray[index][nestedIndex].regex.flag;
                                
                                if (value) {
                                    dataArray[index][nestedIndex] = new RegExp(value, flag);
                                }
                                else {
                                    dataArray.splice(index, 1);
                                }
                            }
                        }
                    }
                })
            }
        })
    }
}

/**
 * Function calls the provided callback with a delay, can be used to avoid unnecessary calls.
 * 
 * @param {Function} callback   :The callback function
 * @param {Number} delay        :The delay in ms
 * @returns 
 */
 export const debounce = (callback, delay = 500) => {
    let delayedFunction;
    
    return (...args) => {
        clearTimeout(delayedFunction);
        delayedFunction = setTimeout(() => { callback.apply(this, args); }, delay);;
    }
}