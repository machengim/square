import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Post, PostList, User, Draft, Comment } from './models';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SquareService {

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
}
