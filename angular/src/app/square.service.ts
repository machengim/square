import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostList, User, Comment } from './models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SquareService {

  constructor(private http: HttpClient,
              private cookie: CookieService) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  private host = 'http://localhost:8080';
  private postListUrl = this.host + '/posts';
  // TODO: change the user id dynamically.
  private userUrl = this.host + '/user';
  private commentUrl = this.host + '/comments';


  // Used for /posts
  getPosts(): Observable<PostList> {
    return this.http.get<PostList>(this.postListUrl);
  }

  // Used for /posts?min={post_id} or /posts?max={post_id}
  getPostsWithOffset(op: string, offset: number): Observable<PostList> {
    return this.http.get<PostList>(this.postListUrl + "?" + op + "=" + offset);
  }

  getUserInfo(id: number): Observable<User> {
    return this.http.get<User>(this.userUrl + '/' + id);
  }

  postDraft(post: Post): Observable<Post> {
    console.log(post);
    return this.http.post<Post>(this.postListUrl, post, this.httpOptions);
  }

  getComments(pid: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentUrl + "?pid=" + pid);
  }

  postComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentUrl, comment, this.httpOptions);
  }

  // Set cookie should be done by server.
  setCookie(id: number, nickname: string): void {
    if (this.cookie.get("square") != "") return;
    let info = '{"id":' + id + ',"nickname":"' + nickname + '"}';
    console.log(info);
    this.cookie.set("square", info, 3, "/", "localhost", false, "None");
  }

  getUserInfoFromCookie(): [number, string] {
    let info = this.cookie.get("square");
    if (info == "") return [-1, ""];
    let json = JSON.parse(info);
    return [json.id, json.nickname];
  }
}
