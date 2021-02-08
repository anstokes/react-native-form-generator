import {
    FORM_ACTION_FETCH_SCHEMA,
    FORM_ACTION_FULFILLED,
    FORM_ACTION_REJECTED,
} from "../actions/types";

const initialState = {
    schema: {},
    loading: false,
    error: '',
};


const form = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        default: return state;

        case FORM_ACTION_FETCH_SCHEMA:
            return {
                ...state,
                ...payload,
            }

        case FORM_ACTION_REJECTED:
            return {
                ...state,
                loading: false,
                error: payload
            }

        case FORM_ACTION_FULFILLED:
            return {
                ...state,
                loading: false
            }
    }
}

export default form;