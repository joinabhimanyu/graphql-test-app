// #1 Import the model created with mongoose
const Contact = require('../models/contact.model');

// #2 Create resolver functions to handle GraphQL queries
/**
 * Query resolver "Contacts" must return values in response to
 * the query "Contacts" in GraphQL schema.
 */
const resolvers = {
  Query: {
    // Query which returns Contacts list
    contacts: async () => await Contact.find({}).exec(),
    findContactById: async (parent, {id})=> await Contact.findById(id).exec(),
    findContacts: async (parent, {params})=>{
      if (params) {
        const query={};
        query['$and']=[];
        if (params.contact_name) {
          query['$and'].push({contact_name:{$regex:params.contact_name}});
        }
        if (params.contact_address) {
          query['$and'].push({contact_address:{$regex:params.contact_address}});
        }
        if (params.contact_email) {
          query['$and'].push({contact_email:{$regex:params.contact_email}});
        }
        if (params.contact_phno) {
          query['$and'].push({contact_phno:{$regex:params.contact_phno}});
        }
        if (params.contact_organization) {
          query['$and'].push({contact_organization:{$regex:params.contact_organization}});
        }
        return await Contact.find(query).exec();
      }
      return await Contact.find({}).exec();
    }
  },

  /**
   * Mutation resolver addContact creates a new document in MongoDB
   * in response to the "addContact" mutation in GraphQL schema.
   * The mutation resolvers must return the created object.
   */
  Mutation: {
    createContact: async (parent, { input }) => {
      try {
        // Create a new record in the database
        const newContact = new Contact({ ...input });
        // Save the record and return it
        const p = await newContact.save();
        return { Contact: p, msg: false };
      } catch (error) {
        console.log(error);
        return { Contact: null, msg: true };
      }
    },
    putContact: async (parent, { input }) => {
      try {
        const p = await Contact.findOneAndReplace({ contact_email: input.contact_email }, { ...input }).exec();
        return { Contact: p, msg: false };
      } catch (error) {
        console.log(error);
        return { Contact: null, msg: true };
      }
    },
    patchContact: async (parent, { input }) => {
      try {
        const p = await Contact.findByIdAndUpdate(input._id, { ...input }).exec();
        return { Contact: p, msg: false };
      } catch (error) {
        console.log(error);
        return { Contact: null, msg: true };
      }
    },
    removeContact: async (parent, { id }) => {
      try {
        await Contact.findByIdAndDelete(id).exec();
        return { success: true, msg: false };
      } catch (error) {
        console.log(error);
        return { success: false, msg: true };
      }
    }
  }
};

module.exports = resolvers;
