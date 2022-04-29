export const LoadingReducer = (prevState={
    isLoading : false
},action) => {
    let { type,loading } = action
    switch (type) {
        case 'change_loading':
            let res = {...prevState}
            res.isLoading = loading
            return res
        default:
            return prevState
    }
}