const isAuthenticated = () => next => (root, args, context, info) => {
    if (!context.currentUser) {
        throw new Error('You are not authenticated!')
    }

    return next(root, args, context, info)
}

module.exports=isAuthenticated;