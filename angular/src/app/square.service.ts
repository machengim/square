import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Post, PostList, PagedList, User, Comment, Mark } from './models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SquareService {

  @Output() refreshUser = new EventEmitter<string>();
  @Output() refreshInfo = new EventEmitter<boolean>();

  constructor(private http: HttpClient,
              private cookie: CookieService) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }), 
    withCredentials: true
  };

  private host = 'http://localhost:8080';
  private postUrl = this.host + '/posts';
  // TODO: change the user id dynamically.
  private userUrl = this.host + '/user';
  private commentUrl = this.host + '/comments';
  private markUrl = this.host + '/marks';

  // Used for /posts
  getPosts(): Observable<PostList> {
    return this.http.get<PostList>(this.postUrl, this.httpOptions);
  }

  // Used for /posts?min={post_id} or /posts?max={post_id}
  getPostsWithOffset(op: string, offset: number): Observable<PostList> {
    return this.http.get<PostList>(this.postUrl + "?" + op + "=" + offset, this.httpOptions);
  }

  getPrivatePost(op: number, page: number): Observable<PagedList> {
    let [uid, nickname] = this.getUserInfoFromCookie();
    let url = this.postUrl + '/user/' + uid + '?op=' + op + '&page=' + page;
    return this.http.get<PagedList>(url, this.httpOptions);
  }

  getUserInfo(id: number): Observable<User> {
    return this.http.get<User>(this.userUrl + '/' + id, this.httpOptions);
  }

  putUserInfo(user: User): Observable<User> {
    return this.http.put<User>(this.userUrl, user, this.httpOptions);
  }

  postDraft(post: Post): Observable<Post> {
    return this.http.post<Post>(this.postUrl, post, this.httpOptions);
  }

  getComments(pid: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentUrl + "?pid=" + pid, this.httpOptions);
  }

  postComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentUrl, comment, this.httpOptions);
  }

  postMark(pid: number): Observable<number> {
    let [uid, _ ] = this.getUserInfoFromCookie();
    let mark: Mark = {id: -1, pid: pid, uid: uid};
    return this.http.post<number>(this.markUrl, mark, this.httpOptions);
  }

  deleteMark(mid: number): Observable<string> {
    return this.http.delete<string>(this.markUrl + "/" + mid, this.httpOptions);
  }

  clearUnreadComments(): Observable<string> {
    let [uid, _ ] = this.getUserInfoFromCookie();
    return this.http.delete<string>(this.commentUrl + "/user/" + uid, this.httpOptions);
  }

  // Set cookie should be done by server.
  setCookie(id: number, nickname: string): void {
    let info = '{"id":' + id + ',"nickname":"' + nickname + '"}';
    this.cookie.set("square", info, 1, "/", "localhost", false, "None");
  }

  getUserInfoFromCookie(): [number, string] {
    let info = this.cookie.get("square");
    if (info == "") return [-1, ""];
    let json = JSON.parse(info);
    console.log("json from cookie: " + json);
    return [json.id, json.nickname];
  }

  userSectionChange(url: string): void {
    this.refreshUser.emit(url);
  }

  draftSent(): void {
    this.refreshInfo.emit(true);
  }
}
