// Set configuration for database
const config = require('./../config/dbconfig');
let configObject = new config();
var util = require('util');
var fs = require('fs');
var multer = require('multer');



module.exports = {
    Registration: function (req, res, next) {
        req.checkBody('first_name', `First name can't be empty`).notEmpty();
        req.checkBody('last_name', `Last name can't be empty`).notEmpty();
        req.checkBody('email_id')
            .isEmail().withMessage(`That email not valid`)
            .trim();
        req.checkBody('password', `Passwords can't be empty`).notEmpty();

        var registration_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_id: req.body.email_id,
            password: req.body.password,
            created_at: '2018-01-29'
        }
        var errors = req.validationErrors();

        if (errors) {
            module.exports.formvalidation(errors, (data) => {
                res.render('registration', {
                    ErrorState: "danger",
                    regMessage: data
                });
            });
            return;
        }


        failureFlah: true;
        var message = "";
        // Insert User's information
        configObject.InsertData("users", registration_data, (data) => {
            var registrationMessage = "";
            if (data) {
                registrationMessage = "Successfully regisration!";
            } else {
                registrationMessage = "Something went wrong!";
            }
            res.render('registration', { ErrorState: "success", registrationMessage: registrationMessage });
        });
    },
    Login: function (req, res, next) {

        var whereClause = [
            req.body.email_id,
            req.body.password
        ];
        configObject.authWherClause("users", whereClause, (data) => {
            if (data.length > 0) {
                // Initialize session
                req.session.userid = data[0].user_id;
                req.session.userName = data[0].first_name + ' ' + data[0].last_name;
                req.session.userImg = data[0].user_img;
                req.session.user_role = data[0].role_id;
                req.session.msg = "test";

                configObject.getUserDetails("users", [req.session.userid], (datas) => {
                    if (datas.length > 0) {
                        res.redirect('/dashboard');
                        return;
                    }

                });

            } else {
                res.render('login', { loginMessage: "Email id or password does not matched!" });
            }

        });
    },

    updateProfile: function (req, res, next) {
        var user_ids = req.session.userid;
        if (req.session.userid === undefined) {
            res.redirect('/login');
            return;

        }
        if (req.params.user_id != undefined) {
            user_ids = req.params.user_id
        }

        if (!req.files) {
            res.status(400).send('No files were uploaded.');
            return;
        } else {
            var imageInfo = "";
            var imageName = "";
            if (Object.keys(req.files).length != 0) {
                imageInfo = req.files.profileImg;
                imageName = imageInfo.name;
                if (imageInfo.mimetype == "image/jpeg" || imageInfo.mimetype == "image/png"
                    || imageInfo.mimetype == "image/gif") {
                    imageInfo.mv('./assets/uploads/' + imageName, function (err) {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                    });
                }
            }
           
            var update_data = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_id: req.body.email_id,
                user_img: imageName
            },
            whereClause = {
                user_id: user_ids
            };
            configObject.updateWhereClause("users", update_data, whereClause, (affectedRows) => {

                if (affectedRows === 1) {

                    configObject.getUserDetails("users", [user_ids], (data) => {
                        
                        if(req.params.user_id== req.session.userid) {
                            res.render('profile', {
                                userData: data, message: "Successfully Updated!",
                                userName: req.body.first_name + req.body.last_name,
                                userImg: imageName
                            });
                            return;
                        }
                        res.render('profile', {
                            userData: data, message: "Successfully Updated!",
                            userName: req.session.userName,
                            userImg: req.session.userImg
                        });
                        return;
                    });

                } else {
                    res.end("Something went wrong!");
                    return;
                }
            });
        }
    },
    userProfile: function (req, res) {
        var userId = null;
        if (req.session.userid === undefined) {
            res.redirect('/login');
            return;
        }
        userId = req.session.userid;
        if (req.params.user_id != undefined) {
            userId = req.params.user_id;
        }

        configObject.getUserDetails("users", [userId], (data) => {
            res.render('profile', {
                userData: data,
                userRole: data[0].role_id,
                userName: req.session.userName,
                userImg: req.session.userImg
            });
        });
    },
    usersProfile: function (req, res) {

        if (req.session.userid === undefined) {
            res.redirect('/login');
            return;
        }
        if (req.params.user_id != undefined) {
            userId = req.params.user_id;
        }
        userId = req.session.userid;
        
       configObject.getUserDetails("users", [req.session.userid], (data) => {
            
            res.render('profile', {
                userData: data,
                userRole: data[0].role_id,
                userImg: req.session.userImg,
                userName: req.session.userName
            });
        });
    },

    DelUser: function (req, res) {
        configObject.removeWhereClause("users", req.params.user_id);
        req.session.msg = "Successfully deleted!";
        res.redirect('/dashboard');

    },

    Dashboard: function (req, res, next) {
        if (req.session.userid === undefined) {
            res.redirect("/login");
            return;
        }

        configObject.getUserDetails("users", [req.session.userid], (singleData) => {
            if (singleData.length > 0) {
                configObject.getDatas("users", (data) => {
                    res.render('dashboard', {
                        userName: req.session.userName,
                        userImg: req.session.userImg,
                        allUserData: data, userRole: singleData[0].role_id,
                        deleteSuccessMsg: req.session.msg
                    });
                });
            } else {
                res.render('login', { loginMessage: "Something went wrong!" });
            }

        });
    },
    postBlog: function (req, res, next) {
        if (req.session.userid === undefined) {
            res.redirect("/login");
            return;
        }
        
        if(req.body.blog_name.length > 0) {
         
            req.checkBody('blog_name', `Blog's name can't be empty`).notEmpty();
            req.checkBody("blog_name", "Blog's contents can;t be empty").notEmpty();
    
            var errors = req.validationErrors();
    
            if (errors) {
                module.exports.formvalidation(errors, (errorMsg) => {
                    res.render('addblogs', {
                        ErrorState: "danger",
                        ErrorMessages: errorMsg
                    });
                });
                return;
            } else {
                // blog image
                var blog_imageInfo = "";
                var blog_imageName = "";
                if (Object.keys(req.files).length != 0) {
                    blog_imageInfo = req.files.blogImg;
                    blog_imageName = blog_imageInfo.name;
    
                    if (blog_imageInfo.mimetype == "image/jpeg" || blog_imageInfo.mimetype == "image/png"
                        || blog_imageInfo.mimetype == "image/gif") {
                        blog_imageInfo.mv('./assets/uploads/' + blog_imageName, function (err) {
                            if (err) {
                                res.status(500).send(err);
                                return;
                            }
                        });
                    }
                }
    
    
                configObject.InsertData("user_blogs", {
                    user_id: req.session.userid,
                    blog_name: req.body.blog_name,
                    blog_img: blog_imageName,
                    blog_content: req.body.blog_contents,
                    create_Date: '2018-02-16'
                }, (data) => {
                    var Message = "";
                    if (data) {
                        Message = "Successfully regisration!";
                    } else {
                        Message = "Something went wrong!";
                    }
                    res.render('addblogs', { ErrorState: "success", finalMessages: Message });
                });
            }
        }
    },
    userBlog: function (req, res) {
        if (req.session.userid === undefined) {
            res.redirect("/login");
            return;
        }
        configObject.getusersBlogs(`
        SELECT * FROM user_blogs t1 INNER JOIN users t2 on t1.user_id = t2.user_id`, (blogdata) => {
                if (blogdata.length > 0) {
                    res.render('userblogs', {
                        userName: req.session.userName,
                        userImg: req.session.userImg,
                        userBlogData: blogdata, userRole:req.session.user_role,
                        deleteSuccessMsg: req.session.msg
                    });
                }

            });


    },
    addBlog: function (req, res, next) {
        if (req.session.userid === undefined) {
            res.redirect("/login");
            return;
        }
        res.render('addblogs');
    },
    formvalidation: function (errors = [], callback) {
        callback(errors);
        return;
    },
    showblogs:function(req, res,next){
        configObject.getusersBlogs(`
        SELECT * FROM user_blogs t1 INNER JOIN users t2 on t1.user_id = t2.user_id`, (showblog) => {
        res.render('blogs',{userBlogData: showblog});
        });
    }
}