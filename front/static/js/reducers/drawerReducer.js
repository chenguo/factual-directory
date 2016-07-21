let initialState = {'open': true}

const drawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_DRAWER':
      return {
        open: !state.open
      }
    default:
      return state
  }
}

export default drawerReducer
