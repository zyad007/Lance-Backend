import { RequestHandler } from "express";
import { LoginType } from "../schemas/Login";
import { UserResgister } from "../schemas/UserResgister";
import * as AdminModel from "../models/AdminModel"
import { compare, hash } from "bcrypt";
import { User } from "../interfaces/User";
import { sign, decode } from "jsonwebtoken";
import NotFound from "../errors/NotFound";
import NotAuthorized from "../errors/NotAuthorized";
import { ForgotPassword } from "../schemas/ForgotPassword";
import BadRequest from "../errors/BadRequest";
import { Result } from "../dto/Result";
import { ResetPassword } from "../schemas/ResetPassword";
import { Admin } from "../interfaces/Admin";

export const login: RequestHandler = async (req, res, next) => {

    try {
        const { email, password }: LoginType = req.body;

        const user = await AdminModel.getByEmail(email);

        if (!user) return next(new NotFound('There is no user with this email'));

        const checkPass = await compare(password, user.password);

        if (!checkPass) return next(new NotAuthorized('Invalid password'));

        const token = sign({
            id: user.id,
            createdAt: new Date()
        }, process.env.SECRET as string);

        return res.status(200).send(new Result(
            true,
            '',
            {
                id: user.id,
                fullName: user.firstName + ' ' + user.lastName,
                email: user.email,
                token,
            }
        ));
    }

    catch (e) {
        next(e)
    }

}

export const register: RequestHandler = async (req, res, next) => {

    try {

        const userData = req.body as UserResgister;

        const passwordHash = await hash(userData.password, 10);

        const admin = {
            id: 0,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            accountStatus: "ACTIVE",
            password: passwordHash,
            accountCreateDate: new Date(),
            passwordCreateDate: new Date()
        }

        const result = await AdminModel.create(admin as Admin)

        const token = sign({
            id: result.id,
            createdAt: new Date()
        }, process.env.SECRET as string)

        return res.status(200).send(new Result(
            true,
            '',
            {
                id: result.id,
                fullName: result.firstName + ' ' + result.lastName,
                email: result.email,
                token,
            }
        ));
    }

    catch (e) {
        next(e);
    }

}


export const forgotPassword: RequestHandler = async (req, res, next) => {

    try {

        const { email }: ForgotPassword = req.body;

        const user = await AdminModel.getByEmail(email);

        if (!user) return next(new BadRequest('There is no user with this email'));

        const resetPasswordToken = Math.random().toString(36).substring(2, 20);

        const newUser = await AdminModel.updateById(user.id, { resetPasswordToken });

        //Send Email with token

        return res.status(200).send(new Result(
            true,
            'Check your email to change your password'
        ))
    }

    catch (e) {
        next(e)
    }
}

export const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        const { resetPasswordToken, newPassword }: ResetPassword = req.body;

        const user = await AdminModel.getOne({ resetPasswordToken });

        if (!user) return next(new NotFound('User not found or invalid token'));

        const newPasswordHash = await hash(newPassword, 10);

        await AdminModel.updateById(user.id, { password: newPasswordHash, resetPasswordToken: '', passwordCreateDate: new Date() });

        res.status(200).send(new Result(
            true,
            'Your password have been changed succesffully!'
        ))
    }
    catch (e) {
        next(e)
    }
}