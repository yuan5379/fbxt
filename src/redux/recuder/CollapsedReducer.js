export const collapsedReducer = (prevState={
    isCollapsed : false
},action) => {
    let { type } = action
    switch (type) {
        case 'change_collapsed':
            let res = {...prevState}
            res.isCollapsed = !res.isCollapsed
            return res
        default:
            return prevState
    }
}