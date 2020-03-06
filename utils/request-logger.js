const path = require('path');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const requestIp = require('request-ip');
const expressip = require('express-ip');

module.exports = function (app) {

    app.use(requestIp.mw())
    app.use(expressip().getIpInfoMiddleware);
    logger.token('type', function (req, res) {
        return req.headers['content-type'];
    });
    logger.format('iplog', function (req, res) {
        if (!req.ipInfo.country) {
            return `${req.clientIp}`
        }
        const ipInfo = req.ipInfo;
        // const useragentIfo = JSON.parse(req.useragent);
        const useragentIfo = req.useragent;
        // console.log(req.useragent)
        // return `${req.clientIp}
        return `${req.clientIp} - ${useragentIfo.browser} - ${useragentIfo.os} - ${useragentIfo.platform}  - ${useragentIfo.isMobile ? "mobile" : useragentIfo.isDesktop ? "desktop" : "bot"} - ${ipInfo.country} - ${ipInfo.region} - ${ipInfo.eu} - ${ipInfo.city} - [${ipInfo.ll}]  - ${ipInfo.area}`;
    });
    const accessLogStream = rfs.createStream('access.log', {
        interval: '1d',
        path: path.join(__dirname, '../logs')
    });
    const logFormat = ":iplog :remote-user [:date[iso]] :method \":url\" HTTP/:http-version :status :res[content-length] - :response-time ms";
    app.use(logger(logFormat, {
        stream: accessLogStream
    }));

}