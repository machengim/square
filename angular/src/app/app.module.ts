import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { ArticleComponent } from './article/article.component';
import { AsideComponent } from './aside/aside.component';
import { FooterComponent } from './footer/footer.component';
import { DraftAreaComponent } from './draft-area/draft-area.component';
import { PostListComponent } from './post-list/post-list.component';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from './comment/comment.component';
import { PostComponent } from './post/post.component';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { UserComponent } from './user/user.component';
import { MessageComponent } from './message/message.component';
import { HelpComponent } from './help/help.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    ArticleComponent,
    AsideComponent,
    FooterComponent,
    DraftAreaComponent,
    PostListComponent,
    CommentComponent,
    PostComponent,
    SettingPageComponent,
    UserComponent,
    MessageComponent,
    HelpComponent,
    SearchComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [CookieService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
