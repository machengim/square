import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { UserComponent } from './user/user.component';


const route: Routes = [
  { path: '', component: ContentComponent, pathMatch: 'full' },
  { path: 'home', component: ContentComponent },
  { path: 'setting', component: SettingPageComponent },
  { path: 'user/:op', component: UserComponent }
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
