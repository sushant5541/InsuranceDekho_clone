exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized Admin Access' });
    }
};
