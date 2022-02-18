const authUser = (req, res, next) => {
    if (req.session.userData)
        if (req.session.userData.Confirmado == 1){
            return next();
        } else {
            return res.redirect('../')
        }
    else
        return res.redirect('/');
};

const authApiAdmin = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Confirmado = 1) {
            if (req.session.userData.Rol == 3) {
                return next();
            } else {
                return res.status(401).redirect('../')
            };
        }
    }else {
        console.log('No ha iniciado sesion')
        return res.redirect('../')
    };
};

const authApiClient = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Confirmado = 1) {
            if (req.session.userData.Rol != 3) {
                return next();
            } else {
                return res.status(401).redirect('../')
            };
        }
    }else {
        console.log('No ha iniciado sesion')
        return res.redirect('../')
    };
};

module.exports = {authUser,authApiAdmin,authApiClient};