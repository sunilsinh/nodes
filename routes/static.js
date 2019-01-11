module.exports = {
    setHome: function (req, res) {
       // req.flash('info', 'invalid username or password');
        res.render('home');
    },
    setLogin: function (req, res) {
        res.render('login');
    },
    setRegistration: function (req, res) {
        res.render('registration');
    },
    setForgotPassword: function (req, res) {
        res.render('forgotpass');
    },
    setLogout: function (req, res) {
        req.session.destroy();
        res.status(301).redirect('/login');
    }
    
}
