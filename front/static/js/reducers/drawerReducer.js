let initialState = {'open': false}

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
