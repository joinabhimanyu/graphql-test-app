const hasRole = (role) => next => (root, args, context, info) => {
    if (!context.currentUser.roles?.find(x=>x.scope===role)) {
        throw new Error('You are not authorized!')
    }

    return next(root, args, context, info)
}

module.exports=hasRole;