const {User} = require("../models");
const {signToken} = require("../utils/auth");

module.exports = {
    async getSingleUser({user = null, params}, res){
        const foundUser = await User.findOne({
           $or: [{_id: user? user._id: params.id}, {username: params.username}],
        });

        if(!foundUser){
            return res.status(400).json({message: 'cannot find user'});
        }
        return res.json(foundUser);
    },
//create user , sign a token for this user and send it back to the SignUpForm
    async createUser({body}, res){
        const user = await User.create(body);
        if(!user){
            return res.status(400).json({message: 'something is wrong'});
        }
        const token = signToken(user);
        res.json({token, user })
    },
    //deconstruct req.body
    async login({body}, res){
        const user = await User.findOne({$or: [{username: body.username}, {email: body.email}]});
        if(!user){
            return res.status(400).json({message: "cant find this user"})
        }
        const correctPw = await user.isCorrectPassword(body.password);
        if(!correctPw){
            return res.status(400).json({message: "incoorect password"})
        }
        const token = signToken(user);
        res.json({token, user}); 
    },
    //save a book to a users savedBooks field by adding to to the set(to prevent duplicates)
        //user comes from req.user createdin the auth middleware function.
    async saveBook({user, body}){
        console.log(user);
        try{
            const updatedUser = await user.findOneAndUpdate(
                {_id: user._id},
                {$addToSet: {savedBooks: body}},
                {new: true, runValidators: true}
            );
            return res.json(updatedUser);
        }catch(e){
            return res.status(400).json(err)
        }
    },
    async deleteBook({user, params}, res){
        const deletedUser = await user.findOneAndDelete(
            {_id: user._id},
            {$pull: {savedBooks: {bookId: params.bookId}}},
            {new: true}
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Couldn't find user with this id!" });
          }
          return res.json(deletedUser);
    }   
}