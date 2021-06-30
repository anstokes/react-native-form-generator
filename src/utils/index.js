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

                        if (keys.length > 0) {
                            // Convert to function from object
                            if (keys.includes('function')) {
                                let args = dataArray[index][nestedIndex].function.args;
                                let body = dataArray[index][nestedIndex].function.body;

                                dataArray[index][nestedIndex] = new Function(args, body);
                            }
                            else if (keys.includes('regex')) {
                                let value = dataArray[index][nestedIndex].regex.value;
                                let flag = dataArray[index][nestedIndex].regex.flag;

                                dataArray[index][nestedIndex] = new RegExp(value, flag);
                            }
                        }
                    }
                })
            }
        })
    }
}