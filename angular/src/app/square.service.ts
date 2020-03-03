import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { Post, PostList, User, Draft } from './models'

@Injectable({
  providedIn: 'root'
})
export class SquareService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  private postListUrl = 'http://localhost:8080/posts';
  // TODO: change the user id dynamically.
  private userUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  // Used for /posts
  getPosts(): Observable<PostList> {
    return this.http.get<PostList>(this.postListUrl);
  }

  // Used for /posts?min={post_id} or /posts?max={post_id}
  getPostsWithOffset(op: string, offset: number): Observable<PostList> {
    return this.http.get<PostList>(this.postListUrl + "?" + op + "=" + offset);
  }

  getUserInfo(id: number): Observable<User> {
    console.log("Start getting user info");
    return this.http.get<User>(this.userUrl + '/' + id);
  }

  postDraft(draft: Draft): Observable<Draft> {
     return this.http.post<Draft>(this.postListUrl, draft, this.httpOptions);
  }
}
