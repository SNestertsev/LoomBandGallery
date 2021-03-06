System.register(["@angular/core", "@angular/router", "./auth.service"], function(exports_1, context_1) {
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
    var core_1, router_1, auth_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(router, authService, zone) {
                    this.router = router;
                    this.authService = authService;
                    this.zone = zone;
                    this.title = "Loom Band Gallery";
                    if (!window.externalProviderLogin) {
                        var self = this;
                        window.externalProviderLogin = function (auth) {
                            self.zone.run(function () {
                                self.externalProviderLogin(auth);
                            });
                        };
                    }
                }
                AppComponent.prototype.isActive = function (data) {
                    return this.router.isActive(this.router.createUrlTree(data), true);
                };
                AppComponent.prototype.logout = function () {
                    var _this = this;
                    // logs out the user, then redirects him to Welcome View.
                    this.authService.logout().subscribe(function (result) {
                        if (result) {
                            _this.router.navigate([""]);
                        }
                    });
                    return false;
                };
                AppComponent.prototype.externalProviderLogin = function (auth) {
                    this.authService.setAuth(auth);
                    console.log("External Login successful! Provider: " + this.authService.getAuth().providerName);
                    this.router.navigate([""]);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "app",
                        template: "\n<nav class=\"navbar navbar-default navbar-fixed-top\">\n    <div class=\"container-fluid\">\n        <input type=\"checkbox\" id=\"navbar-toggle-cbox\">\n        <div class=\"navbar-header\">\n            <label for=\"navbar-toggle-cbox\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" ariacontrols=\"navbar\">\n                <span class=\"sr-only\">Toggle navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </label>\n            <a class=\"navbar-brand\" href=\"#\">\n                <img alt=\"logo\" src=\"/img/logo.svg\" />\n            </a>\n        </div>\n        <div class=\"collapse navbar-collapse\" id=\"navbar\">\n            <ul class=\"nav navbar-nav\">\n                <li [class.active]=\"isActive([''])\">\n                    <a class=\"home\" [routerLink]=\"['']\">Home</a>\n                </li>\n                <li [class.active]=\"isActive(['about'])\">\n                    <a class=\"about\" [routerLink]=\"['about']\">About</a>\n                </li>\n                <li *ngIf=\"!authService.isLoggedIn()\" [class.active]=\"isActive(['login'])\">\n                    <a class=\"login\" [routerLink]=\"['login']\">Login / Register</a>\n                </li>\n                <li *ngIf=\"authService.isLoggedIn()\">\n                    <a class=\"logout\" href=\"javascript:void(0)\" (click)=\"logout()\">Logout</a>\n                </li>\n                <li *ngIf=\"authService.isLoggedIn()\" [class.active]=\"isActive(['item/edit', 0])\">\n                    <a class=\"add\" [routerLink]=\"['item/edit', 0]\">Add New</a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n<h1 class=\"header\">{{title}}</h1>\n<div class=\"main-container\">\n    <router-outlet></router-outlet>\n</div>\n"
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, auth_service_1.AuthService, core_1.NgZone])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
