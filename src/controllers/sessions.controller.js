import { generateToken } from "../utils.js"
import config from "../config/config.js"


export default class SessionsController {
    static #instance

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new SessionsController()
        }
        return this.#instance
    }

    register(req, res) {
        res.sendSuccessMessage("Usuario registrado exitosamente")
    }

    login(req, res) {
        const user = req.user
        const token = generateToken(user)
        res.cookie("token", token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true })
        res.sendSuccessPayload(req.user)
    }

    githubCallback(req, res) {
        const user = req.user
        const token = generateToken(user)
        res.cookie("token", token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true })
        res.redirect("/products")
    }

    

    current(req, res) {
        res.sendSuccessPayload(req.user)
    }

    logout(req, res) {
        res.clearCookie("token")
        res.sendSuccessMessage("Sesión cerrada exitosamente")
    }
}