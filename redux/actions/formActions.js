// Import: Action types
import {
    FORM_ACTION_PENDING,
    FORM_ACTION_FULFILLED,
    FORM_ACTION_REJECTED,
    FORM_ACTION_FETCH_SCHEMA,
    FORM_ACTION_UPDATE_SCHEMA
} from './types';

// Import: Util functions
import { store } from "../store";
import simpleSchema from '../data/simpleSchema.json';
import advancedSchema from '../data/advancedSchema.json';
import paginatedSchema from '../data/paginatedSchema.json';


const schema = {
    "initialScreen": "screen1",
    "screens": {
        "screen1": {
            "title": "Unidirectional",
            "description": "These samples are best viewed without live validation.",
            "actions": {
                "next": {
                    "type": "navigation",
                    "action": "next",
                    "label": "Next",
                    "navigateTo": "screen2",
                    "validation": {
                        "disabled": "errors",     // "errors" | specific error. Currently disabled if there are any errors.
                    },
                    "props": {
                        "mode": "contained"
                    }
                }
            },
            "properties": {
                "name": {
                    "type": "string",
                    "value": "Nicolae",
                    "label": "Name",
                    "props": {
                        "mode": "outlined",
                        "dense": true,
                    },
                    "validation": [
                        ["string"],
                        ["required", "Name is required"]
                    ],
                },
                "credit_card": {
                    "type": "string",
                    "label": "Credit Card",
                    "props": {
                        "mode": "outlined",
                        "dense": true,
                    },
                    "validation": [
                        ["string"],
                        ["matches", /[0-9]/, "Only numbers allowed"],
                        ["max", 14, "Maximum 14 characters"]
                    ]
                },
                "billing_address": {
                    "type": "string",
                    "label": "Billing Address",
                    "props": {
                        "mode": "outlined",
                        "dense": true,
                        "multiline": true,
                        "numberOfLines": 3,
                    },
                    "validation": [
                        ["string"],
                        ["when",
                            "credit_card",
                            function (value, schema) {
                                return value ? schema.required("Please enter billing address for credit card.") : schema.notRequired();
                            }]
                    ],
                    "customValidation": {
                        "hidden": {
                            "fields": ["credit_card"],
                            "values": [""]
                        }
                    }
                }, "new_checkbox": {
                    "type": "checkbox",
                    "label": "Test Checkbox",
                    "value": false,
                    "validation": [
                        ["boolean"]
                    ]
                },
                "new_account": {
                    "type": "switch",
                    "label": "New Account",
                    "value": false,
                    "validation": [
                        ["boolean"]
                    ],
                    "customValidation": {
                        "hidden": {
                            "fields": ["new_checkbox"],
                            "values": [false]
                        },
                    }
                },
                "new_radio": {
                    "type": "radio",
                    "label": "Test Radio",
                    "value": "first",
                    "props": {
                        "options": [
                            {
                                "label": "First",
                                "value": "first",
                            },
                            {
                                "label": "Second",
                                "value": "second",
                            },
                        ]
                    },
                    "validation": [
                        ["string"],
                        ["when", ["new_account", "new_checkbox"], function (newAccount, newCheckbox, schema) {
                            return newCheckbox && newAccount ? schema.matches(/second/, {
                                message: "Only second allowed",
                                excludeEmptyString: true
                            }) : schema.matches(/.*/);
                        }]
                    ],
                },
                "new_image": {
                    "type": "imagePicker",
                    "label": "Test Image",
                    "value": "",
                    "props": {
                        "pickerOptions": {
                            "mediaTypes": "Images",     // "All" | "Videos" | "Images"
                            "allowsEditing": true,
                            "aspect": [4, 3],
                            "quality": 1,
                        }
                    }
                }

            }
        },
    }
};


/**
 * Action used to initialize any account actions.
 * It sets the loading state to true.
 *
 */
const formActionPending = () => {
    dispatch({
        type: FORM_ACTION_PENDING
    })
};


/**
 * Action used to finalize any account action successfully.
 * The action sets the loading state to false.
 *
 */
const formActionFulfilled = () => {
    dispatch({
        type: FORM_ACTION_FULFILLED
    })
};


/**
 * Action used to finalize any settings action with an error.
 * It sets an error message and loading to false.
 *
 * @param error
 */
const formActionRejected = (error) => {
    dispatch({
        type: FORM_ACTION_REJECTED,
        payload: error
    })
};


export const fetchFormSchema = () => {

    try {
        store.dispatch({
            type: FORM_ACTION_FETCH_SCHEMA,
            payload: { schema: { simpleSchema, advancedSchema, paginatedSchema } }
        })
    }
    catch (e) {
        console.warn('Failed to fetch schema from server');

        if (e.message) {
            console.error(e.message);
        }
    }
}