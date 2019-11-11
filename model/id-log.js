
module.exports = function(ctx) {
    // const _id = ctx.update.callback_query.from.id;
    // const _id = ctx.message.from.id;
    try {
        const logRecord = ctx.message 
            ? new Date() + "  user - " + ctx.message.from.first_name +" " + ctx.message.from.last_name + " " + ctx.message.text + "\r"
            : new Date() + "  user - " + ctx.update.callback_query.from.first_name +" " + ctx.update.callback_query.from.last_name +" ctx.update.callback_query" + "\r";
        require('fs').appendFile("./data/userslog.txt", logRecord, err=>{if (err) console.error(err)});
    } catch (error) {
        console.log(error);
        // require('fs').appendFile("./data/userslog.txt", logRecord, err=>{if (err) console.error(err)});
        
    }

}