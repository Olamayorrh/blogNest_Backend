const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

const blogger = (req, res, next) => {
    if (req.user && (req.user.role === 'blogger' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as a blogger');
    }
};

module.exports = { admin, blogger };
