const test = require("./test");
const solanaSdk = require('./solanaSdk')


module.exports = (app) => {
	app.use("/test", test);
    app.use("/solanaSdk", solanaSdk)
};
