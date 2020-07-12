import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { UserComponent } from './user/user.component';
import { MessageComponent } from './message/message.component';
import { HelpComponent } from './help/help.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';


const route: Routes = [
  { path: '', component: AppComponent },
  { path: 'home', component: ContentComponent, pathMatch: 'full' },
  { path: 'setting', component: SettingPageComponent },
  { path: 'user/:op', component: UserComponent },
  { path: 'message', component: MessageComponent },
  { path: 'help', component: HelpComponent },
  { path: 'search/:keyword', component: SearchComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(route)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }