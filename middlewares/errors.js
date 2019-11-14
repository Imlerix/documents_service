module.exports = async (req, res, next) => {
    try {
        await next()
    } catch (e) {
        res.status(e.status || 500).json({error: 'Internal Server Error'})
    }
}
