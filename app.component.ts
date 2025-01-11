import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { userformcomponent } from "./userform/userform.component";
 @Component({
  selector: 'app-root',
  standalone:true,
  imports:[HeaderComponent,  userformcomponent],
  templateUrl:'./app.Component.html',
  styleUrls:['./app.component.css']
 })
 export class appcomponent{

 }