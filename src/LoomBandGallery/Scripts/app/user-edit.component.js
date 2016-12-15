System.register(["@angular/core", "@angular/forms", "@angular/router", "./auth.service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, forms_1, router_1, auth_service_1;
    var UserEditComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }],
        execute: function() {
            UserEditComponent = (function () {
                function UserEditComponent(fb, router, authService) {
                    this.fb = fb;
                    this.router = router;
                    this.authService = authService;
                    this.title = "New User Registration";
                    this.userForm = null;
                    this.errorMessage = null;
                    if (this.authService.isLoggedIn()) {
                        this.router.navigate([""]);
                    }
                }
                UserEditComponent.prototype.ngOnInit = function () {
                    this.userForm = this.fb.group({
                        username: ["", [
                                forms_1.Validators.required,
                                forms_1.Validators.pattern("[a-zA-Z0-9]+")
                            ]],
                        email: ["", [
                                forms_1.Validators.required,
                                forms_1.Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[az0-9!#$ %&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[az0-9](?:[a - z0 - 9 -]* [a - z0 - 9])?")
                            ]],
                        password: ["", [
                                forms_1.Validators.required,
                                forms_1.Validators.minLength(6)]],
                        passwordConfirm: ["", [
                                forms_1.Validators.required,
                                forms_1.Validators.minLength(6)]],
                        displayName: ["", null]
                    }, {
                        validator: this.compareValidator('password', 'passwordConfirm')
                    });
                };
                UserEditComponent.prototype.compareValidator = function (fc1, fc2) {
                    return function (group) {
                        var password = group.controls[fc1];
                        var passwordConfirm = group.controls[fc2];
                        if (password.value === passwordConfirm.value) {
                            return null;
                        }
                        return { compareFailed: true };
                    };
                };
                UserEditComponent.prototype.onSubmit = function () {
                    var _this = this;
                    this.authService.add(this.userForm.value)
                        .subscribe(function (data) {
                        if (data.error == null) {
                            // registration successful
                            _this.errorMessage = null;
                            _this.authService.login(_this.userForm.value.username, _this.userForm.value.password)
                                .subscribe(function (data) {
                                // login successful
                                _this.errorMessage = null;
                                _this.router.navigate([""]);
                            }, function (err) {
                                console.log(err);
                                // login failure
                                _this.errorMessage =
                                    "Warning: Username or Password mismatch";
                            });
                        }
                        else {
                            // registration failure
                            _this.errorMessage = data.error;
                        }
                    }, function (err) {
                        // server/connection error
                        _this.errorMessage = err;
                    });
                };
                UserEditComponent = __decorate([
                    core_1.Component({
                        selector: "user-edit",
                        template: "\n<div class=\"user-container\">\n    <form class=\"form-user\" [formGroup]=\"userForm\" (submit)=\"onSubmit()\">\n        <h2 class=\"form-user-heading\">{{title}}</h2>\n        <div class=\"form-group\">\n            <input formControlName=\"username\" type=\"text\" class=\"formcontrol\" placeholder=\"Choose an Username\" autofocus />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.username.valid\">\n                <span class=\"glyphicon glyphicon-ok\" ariahidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.username.valid && !this.userForm.controls.username.pristine\">\n                <span class=\"glyphicon glyphicon-remove\" ariahidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"email\" type=\"text\" class=\"form-control\" placeholder=\"Type your e-mail address\" />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.email.valid\">\n                <span class=\"glyphicon glyphicon-ok\" ariahidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.email.valid && !this.userForm.controls.email.pristine\">\n                <span class=\"glyphicon glyphicon-remove\" ariahidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"password\" type=\"password\" class=\"formcontrol\" placeholder=\"Choose a Password\" />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.password.valid && !this.userForm.controls.password.pristine\">\n                <span class=\"glyphicon glyphicon-ok\" ariahidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"!this.userForm.controls.password.valid && !this.userForm.controls.password.pristine\">\n                <span class=\"glyphicon glyphicon-remove\" ariahidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"passwordConfirm\" type=\"password\" class=\"form-control\" placeholder=\"Confirm your Password\" />\n            <span class=\"validator-label valid\" *ngIf=\"this.userForm.controls.passwordConfirm.valid && !this.userForm.controls.password.pristine && !this.userForm.hasError('compareFailed')\">\n                <span class=\"glyphicon glyphicon-ok\" ariahidden=\"true\"></span>\n                valid!\n            </span>\n            <span class=\"validator-label invalid\" *ngIf=\"(!this.userForm.controls.passwordConfirm.valid && !this.userForm.controls.passwordConfirm.pristine) || this.userForm.hasError('compareFailed')\">\n                <span class=\"glyphicon glyphicon-remove\" ariahidden=\"true\"></span>\n                invalid\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <input formControlName=\"displayName\" type=\"text\" class=\"formcontrol\" placeholder=\"Choose a Display Name\" />\n        </div>\n        <div class=\"form-group\">\n            <input type=\"submit\" class=\"btn btn-primary btn-block\" [disabled]=\"!userForm.valid\" value=\"Register\" />\n        </div>\n    </form>\n</div>\n"
                    }), 
                    __metadata('design:paramtypes', [forms_1.FormBuilder, router_1.Router, auth_service_1.AuthService])
                ], UserEditComponent);
                return UserEditComponent;
            }());
            exports_1("UserEditComponent", UserEditComponent);
        }
    }
});
