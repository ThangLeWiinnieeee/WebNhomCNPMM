<<<<<<< HEAD
const generateRandomNumber = (length) => {
=======
export const generateRandomNumber = (length) => {
>>>>>>> 32d886ad0875d9dcd52815c46263627081678a94
    const characters = "0123456789";
    let result = "";
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
export { generateRandomNumber };