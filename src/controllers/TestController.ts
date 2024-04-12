import { RequestHandler } from "express";
import { LoginType } from "../schemas/LoginSchema";

export const login: RequestHandler = async (req, res, next) => {

    try {

        const { username, password }: LoginType = req.body;

        // API Logic

        return res.status(200).send();
 
    }

    catch(e) {
        next(e)
    }

}