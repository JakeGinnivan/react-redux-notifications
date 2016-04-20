export const API_CALL = 'demo/API_CALL'
export const API_CALL_SUCCESS = 'demo/API_CALL_SUCCESS'
export const API_CALL_FAILED = 'demo/API_CALL_FAILED'

export function apiCall() {
  return dispatch => {
    dispatch({
      type: API_CALL
    })

    setTimeout(() => {
      dispatch({
        type: API_CALL_SUCCESS
      })
    }, 1000)
  }
}


export default function(state = { }) {
  return state
}
