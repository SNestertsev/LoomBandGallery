import { Component } from "@angular/core";

@Component({
    selector: "about",
    template: `
<h2>{{title}}</h2>
<div>Loom Band Gallery is a sample site implemented with ASP.NET Core, .NET Framework and Angular 2.</div>
`
})
export class AboutComponent {
    title = "About";
}