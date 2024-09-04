const User = require("../models/user.js");


module.exports.signup=async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      email,
      username,
    });

    const registerUser = await User.register(user, password);

    req.login(registerUser,(err)=>{
      if(err){
        return next(err)
      }
      console.log(registerUser);
      req.flash("success", "Welcome to WanderLust");

      res.redirect("/listings");

    })
   
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}


module.exports.login=async (req, res) => {
  req.flash("success", "Welcome to WanderLust");

  res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout=(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err)
    }
    req.flash("success","you are logout")
    res.redirect("/listings")

  })

}

module.exports.renderSignupForm=async (req, res) => {
  res.render("users/signup.ejs");
}