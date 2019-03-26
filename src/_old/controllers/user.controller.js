import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import Role from '../security/role.security';

const projection = {
    __v: false,
    password: false
};

const passwordSalt = 10;

export const create = (req, res, next) => {
        /*
        const { errors, isValid } = validateRegisterInput(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        */

    User.findOne({ email: req.body.email }, projection)
    .then(user => {
        if (user) 
            throw new Error('Email already exists.');

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            lastName: req.body.lastName,
            password: req.body.password,
            role: req.body.role
        });
        bcrypt.genSalt(passwordSalt, (err, salt) => {
            if (err) throw err;

            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser.save()
                .then(user => {
                    res.status(201).json({
                        status: 'success', 
                        data: user
                    })
                })
                .catch(next);
            });
        });
    })
    .catch(next);  

};

export const update = (req, res, next) => {

    User.findById(req.params.user_id)
    .then(user => {
        if (!user) 
            throw new Error('This user does not exists.');
        if (Role.Admin != req.user.role && user._id != req.user.id)
            throw new Error('You are not the owner of this user.');

        user.name = req.body.name;
        user.lastName = req.body.lastName;
        let newPassword = req.body.password;
        if (newPassword) {
            let salt = bcrypt.genSaltSync(passwordSalt);
            let hash = bcrypt.hashSync(newPassword, salt);
            user.password = hash;
        }
        user.save()
        .then(user => {
            res.status(200).json({
                status: 'success', 
                message: 'User updated successfully.'
            })
        })
        .catch(next);
    })
    .catch(next);

};

export const remove = (req, res, next) => {

    User.findOne({_id: req.params.user_id})
    .then(user => {
        if (!user) 
            throw new Error('This user does not exists.');
        if (user.role == 'Admin') 
            throw new Error('You can not delete Administrator.');

        user.remove()
        .then(user => {
            res.status(200).json({
                status: 'success', 
                message: 'User removed successfully.'
            })
        })
        .catch(next); 
    })
    .catch(next);

};

export const getOne = (req, res, next) => {
    
    User.findById(req.params.user_id, projection)
    .then(user => {
        if (!user) 
            throw new Error('This user does not exists.');
        if (Role.Admin != req.user.role && user._id != req.user.id)
            throw new Error('You are not the owner of this user.');

        res.status(200).json({
            status: 'success',
            data: user
        });
    })
    .catch(next);

};

export const getAll = (req, res, next) => {

    User.find({}, projection)
    .then(users => {
        res.status(200).json({
            status: 'success',
            data: users
        });
    })
    .catch(next);

};

