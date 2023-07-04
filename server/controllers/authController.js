import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

/* REGISTER USER */

export const register = async (req, res) => {
    console.log(req);
try {
    const { firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
    } = req.body;
    // this is to generate a salt to use it to decrypt the password with the hash , and this is way more secure than just hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 1000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    
} catch (error) {
    res.status(500).json({error: error.message});
}
}

/* LOGGING IN */


export const login = async (req, res) => {
try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id:user._id},process.env.JWT_SECRET);
    // this is to not send the password in the response to the front end
    delete user.password;
    res.status(200).json({ user, token });
} catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)
}
}


