exports.ensureAuthenticated = function(req, res, next) {
  if('email is authenticated') {
    if(req.session.currentUserEmail) {
      console.log('account is authenticated, proceed with sensitive calls');
      return next();
    }

  }
  else {
    console.log('email wasnt authenticated, go to login page');
    res.redirect('/auth/linkedin');
  }
}
