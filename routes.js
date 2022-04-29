const { sampleHandler } = require('./handlers/routeHandlers/sampleHandlers');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
