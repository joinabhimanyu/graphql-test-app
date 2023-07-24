// #1 Import the model created with mongoose
const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// #2 Create resolver functions to handle GraphQL queries
/**
 * Query resolver "posts" must return values in response to
 * the query "posts" in GraphQL schema.
 */
const resolvers = {
    Query: {
        // Query which returns posts list
        users: async () => await User.find({}).exec(),
        login: async (parent, { userid, password }) => {
            try {
                console.log('userid: ', userid);
                console.log('password: ', password);
                const user = await User.findOne({ userid: userid }).exec();
                if (user) {
                    console.log('user password: ', user.password);
                    const compare = await bcrypt.compare(password, user.password);
                    if (compare) {
                        let jwtToken = jwt.sign(
                            {
                                email: user.email,
                                userId: user.userid,
                            },
                            "longer-secret-is-better",
                            {
                                expiresIn: "1h",
                            }
                        );
                        return {
                            token: jwtToken,
                            expiresIn: 3600,
                            _id: user._id,
                            userId: user.userid
                        };
                    }
                }
                return false;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    },

    /**
     * Mutation resolver addPost creates a new document in MongoDB
     * in response to the "addPost" mutation in GraphQL schema.
     * The mutation resolvers must return the created object.
     */
    Mutation: {
        createUser: async (parent, { input }) => {
            try {
                // Create a new record in the database
                if (input.password) {
                    const hash = await bcrypt.hash(input.password, saltRounds);
                    if (hash) {
                        const newUser = new User({ ...input, password: hash });
                        // Save the record and return it
                        const p = await newUser.save();
                        return { user: p, msg: false };
                    }
                }
            } catch (error) {
                console.log(error);
                return { user: null, msg: true };
            }
        },
        putUser: async (parent, { input }) => {
            try {
                if (input.password) {
                    const hash = await bcrypt.hash(input.password, saltRounds);
                    if (hash) {
                        const p = await User.findOneAndReplace({ firstname: input.firstname }, { ...input, password: hash }).exec();
                        return { user: p, msg: false };
                    }
                }
            } catch (error) {
                console.log(error);
                return { user: null, msg: true };
            }
        },
        patchUser: async (parent, { input }) => {
            try {
                if (input.password) {
                    const hash = await bcrypt.hash(input.password, saltRounds);
                    if (hash) {
                        const p = await User.findByIdAndUpdate(input._id, { ...input, password: hash }).exec();
                        return { user: p, msg: false };
                    }
                }
            } catch (error) {
                console.log(error);
                return { user: null, msg: true };
            }
        },
        removeUser: async (parent, { id }) => {
            try {
                await User.findByIdAndDelete(id).exec();
                return { success: true, msg: false };
            } catch (error) {
                console.log(error);
                return { success: false, msg: true };
            }
        },
    }
};

module.exports = resolvers;
