import bcrypt from "bcrypt";

export function generateToken(userId, amount, number, operator) {
    // Générer un salt
    const salt = bcrypt.genSaltSync(10);
    const userIdHacher = bcrypt.hashSync(userId, salt);

    return (
        "paycash-" +
        userIdHacher +
        "-" +
        amount +
        "-" +
        number +
        "-" +
        operator +
        "-" +
        Math.random().toString(36).substring(2, 8) +
        Math.random().toString(36).substring(2, 8)
    );
}
export function generateTransfertToken(fromUserId, toUserId, amount) {
    // Générer un salt
    const salt = bcrypt.genSaltSync(10);
    const fromUserIdHacher = bcrypt.hashSync(fromUserId, salt);
    const toUserIdHacher = bcrypt.hashSync(toUserId, salt);

    return (
        "paycash-" +
        fromUserIdHacher +
        "-" +
        toUserIdHacher +
        "-" +
        amount +
        "-" +
        Math.random().toString(36).substring(2, 8) +
        Math.random().toString(36).substring(2, 8)
    );
}
