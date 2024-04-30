export const productError = (product) => {
    return "verificar campos enviados, alguno es erroneo" +
        "\n- titulo recibido invalido" + product.title +
        "\n- código recibido invalido" + product.code +
        "\n- precio recibido invalido" + product.price
}