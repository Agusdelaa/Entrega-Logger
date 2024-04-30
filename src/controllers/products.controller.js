import ProductsRepository from "../repositories/products.repository.js"
import {productError} from "../services/manageErrors/error.log.js"
import CustomizedError from "../services/manageErrors/customized.error.js"

export default class ProductsController {
    static #instance

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductsController()
        }
        return this.#instance
    }

    async getProducts(req, res) {
        try {
            const queryParams = req.query
            const payload = await ProductsRepository.getInstance().getProducts(queryParams)
            res.sendSuccessPayload(payload)
        } catch (error) {
            req.logger.error(error)
            res.sendServerError(error.message)
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params
            const payload = await ProductsRepository.getInstance().getProductById(pid)
            console.log(pid)
            
            res.sendSuccessPayload(payload)
        } catch (error) {
            req.logger.error(error)
            res.sendServerError(error.message)
        }
    }

    async createProduct(req, res) {
        try {
            const { title, code, price } = req.body
            if (!title || !code || !price || isNaN(price) || price <= 0) {
                CustomizedError.createError({
                    name: "Error",
                    cause: productError({ title, code, price }),
                    message: "Error al crear el producto",
                    code: 999
                })
            }
            const newProduct = req.body
            const product = await ProductsRepository.getInstance().getProductByCode(newProduct.code)
            if (product) {
                return res.sendUserError(`Ya existe un producto con el código ${newProduct.code}`)
            }
            const payload = await ProductsRepository.getInstance().createProduct(newProduct)
            res.sendSuccessPayload(payload)
        } catch (error) {
            if (error.code == 999) {
                return res.sendUserError(`${error.message} ${error.cause}`)
            }
            req.logger.error(error)
            res.sendServerError(error.message)
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params
            const updatedProduct = req.body
            let product = await ProductsRepository.getInstance().getProductById(pid)
            if (!product) {
                return res.sendUserError(`No existe un producto con el id ${pid}`)
            }
            if (updatedProduct.code !== product.code) {
                product = await ProductsRepository.getInstance().getProductByCode(updatedProduct.code)
                if (product) {
                    return res.sendUserError(`Ya existe un producto con el código ${updatedProduct.code}`)
                }
            }
            const payload = await ProductsRepository.getInstance().updateProduct(pid, updatedProduct)
            res.sendSuccessPayload(payload)
        } catch (error) {
            req.logger.error(error)
            res.sendServerError(error.message)
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params
            const product = await ProductsRepository.getInstance().getProductById(pid)
            if (!product) {
                return res.sendUserError(`No existe un producto con el id ${pid}`)
            }
            const payload = await ProductsRepository.getInstance().deleteProduct(pid)
            res.sendSuccessPayload(payload)
        } catch (error) {
            req.logger.error(error)
            res.sendServerError(error.message)
        }
    }
}