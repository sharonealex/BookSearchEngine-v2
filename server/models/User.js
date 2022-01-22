const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require ('validator');

//import subdocument Book.js schema
const bookSchema = require("./Book");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail, "invalid email"]
        },
        password: {
            type: String,
            required: true
        },
        savedBooks: [bookSchema]
    },
    {
        toJSON: {
            virtuals: true
        }
    },
);
//pre save middleware hook for schema for before saving the field into the database.
userSchema.pre('save', async function(next){
 if(this.isNew || this.isModified("password")){
     const saltRounds = 10;
     this.password = await bcrypt.hash(this.password, saltRounds);
 };
 next();
});


//isNew and isModified are schemas prototype methods. Document.prototype.$isNew, Document.prototype.toString(), Document.prototype.$parent() are examples
//Schema.prototype.method() will add an instance method to documents constructed from Models compiled from this schema.

//Each Schema can define instance and static methods for its model.

userSchema.methods.isCorrectPassword = async function(password){
 return bcrypt.compare(password, this.password)
}//custom method to compare instance password for the logged in user

userSchema.virtual('bookCount').get(function(){
    return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;

