(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{20:function(e,t,n){e.exports=n(38)},26:function(e,t,n){},27:function(e,t,n){},28:function(e,t,n){},29:function(e,t,n){},35:function(e,t,n){},36:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(17),o=n.n(c),l=n(4),u=n(2),s=n(1),i=n(12),m=n.n(i),d=n(18),f="https://masq.xyz/api/";function p(e,t,n){fetch(e,{credentials:"include"}).then((function(e){e.ok?t(e):n(e)})).catch((function(e){n(e)}))}function b(e,t,n,a){fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:t,credentials:"include"}).then((function(e){E(e.headers.get("instruction")),200===e.status?n(e):a(e)})).catch((function(e){a(e)}))}function E(e){return!(!e||"clear"!==e)&&(g(),!0)}function g(){window.localStorage.removeItem("summary"),window.localStorage.removeItem("lastUpdate")}function h(e){localStorage.setItem("summary",JSON.stringify(e)),localStorage.setItem("lastUpdate",JSON.stringify(new Date))}var v=n(10),O=n.n(v),j=Object(a.createContext)({updateUser:!1,updatePosts:!1,setUpdateUser:null,setUpdatePosts:null});function y(e){var t=Object(a.useState)(!1),n=Object(s.a)(t,2),c=n[0],o=n[1],l=Object(a.useState)(!1),u=Object(s.a)(l,2),i=u[0],m=u[1];return r.a.createElement(j.Provider,{value:{updateUser:c,updatePosts:i,setUpdateUser:o,setUpdatePosts:m}},e.children)}var w=Object(a.createContext)({user:{uid:-1,uname:"Guest",posts:0,marks:0,messages:0,type:-1},setUser:function(){}});function S(e){var t=Object(a.useState)(!1),n=Object(s.a)(t,2),c=n[0],o=n[1],l=Object(a.useContext)(j),u=Object(a.useState)(l.updateUser),i=Object(s.a)(u,2),m=i[0],d=i[1],b=Object(a.useState)(function(){var e={uid:-1,uname:"Guest",posts:0,marks:0,messages:0,type:-1},t=O.a.get("u");if(t){var n=window.localStorage.getItem("summary");if(n)try{var a=JSON.parse(n);a.uid===+t?e=a:window.localStorage.removeItem("summary")}catch(r){console.log("Cannot parse local stored content to user summary: "+r)}else e.uid=+t}return e}()),v=Object(s.a)(b,2),y=v[0],S=v[1];function k(e){E(e.headers.get("instruction"))&&S({uid:-1,uname:"Guest",posts:0,marks:0,messages:0,type:-1}),e.json().then((function(e){h(e),S(e),o(!1),l.setUpdateUser&&l.setUpdateUser(!1)})).catch((function(){console.log("Cannot parse json!\n"+e)}))}function C(e){console.error(e)}return Object(a.useState)((function(){return function(){if(y.uid<=0)return void g();(function(){var e=window.localStorage.getItem("lastUpdate");if(!e)return!1;var t=new Date(JSON.parse(e));if(!t)return!1;var n=(new Date).getTime()-t.getTime();if(!n||n>36e5)return!1;return!0})()||o(!0);O.a.get("u")&&!window.localStorage.getItem("summary")&&o(!0)}()})),Object(a.useEffect)((function(){d(l.updateUser)}),[l.updateUser]),Object(a.useEffect)((function(){m&&y.uid>0?p(f+"user/summary/"+y.uid,k,C):l.setUpdateUser&&l.setUpdateUser(!1)}),[m]),Object(a.useEffect)((function(){c&&y.uid>0?p(f+"user/summary/"+y.uid,k,C):o(!1)}),[c]),r.a.createElement(w.Provider,{value:{user:y,setUser:S}},e.children)}n(26);function k(){var e=Object(a.useContext)(j),t=Object(a.useContext)(w),n=Object(a.useState)(t.user),c=Object(s.a)(n,2),o=c[0],l=c[1],u=Object(a.useState)(!1),i=Object(s.a)(u,2),p=i[0],E=i[1],g=Object(a.useState)(""),h=Object(s.a)(g,2),v=h[0],O=h[1],y=Object(a.useState)(!1),S=Object(s.a)(y,2),k=S[0],C=S[1],N=Object(a.useState)(!1),x=Object(s.a)(N,2),U=x[0],P=x[1],D=Object(a.useState)("Choose image"),_=Object(s.a)(D,2),I=_[0],M=_[1],L=Object(a.useState)(null),R=Object(s.a)(L,2),J=R[0],A=R[1],q=Object(a.useState)(!1),T=Object(s.a)(q,2),F=T[0],z=T[1],G=Object(a.useRef)(null);function B(e){if(e.target.files){var t=e.target.files[0];(function(e){if(!e)return alert("No file found."),!1;if(e.size>5242880)return alert("Max file size is 5MB."),!1;if(!e.type.includes("image"))return alert("Only image file allowed."),!1;return!0})(t)&&A(t)}}function W(e){return new Promise((function(t,n){var a=new FileReader;a.readAsDataURL(e),a.onloadend=function(){a&&a.result&&t(a.result.toString())},a.onerror=n}))}function H(){return(H=Object(d.a)(m.a.mark((function e(){var t,n,a;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t="",!J){e.next=12;break}if(!(o.type<=2)){e.next=7;break}return alert("Sorry, you cannot upload images, please remove it"),e.abrupt("return");case 7:return e.next=9,W(J);case 9:t=e.sent;case 10:e.next=15;break;case 12:if(0!==v.trim().length){e.next=15;break}return alert("No content found."),e.abrupt("return");case 15:n=k?"Anonymous":o.uname,a={uid:o.uid?o.uid:-1,uname:n,anonymous:k,content:v,ctime:new Date,status:U?0:1,image:t||null},z(!0),b(f+"posts",JSON.stringify(a),$,Y);case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(t){O(""),A(null),z(!1),e.setUpdatePosts&&e.setUpdatePosts(!0),e.setUpdateUser&&e.setUpdateUser(!0)}function Y(e){z(!1),alert(e)}return Object(a.useEffect)((function(){l(t.user)}),[t]),Object(a.useEffect)((function(){if(J){var e=J.name;e.length>15&&(e=".."+e.slice(-15)),M(e)}else M("Choose image")}),[J]),r.a.createElement("div",{id:"draft_area"},r.a.createElement("span",null,"Write a post:",r.a.createElement("br",null)),r.a.createElement("textarea",{name:"draft",value:v,className:p?"selected":"",placeholder:"Share your thought",onFocus:function(){return E(!0)},onChange:function(e){O(e.target.value)}}),r.a.createElement("button",{className:p?"":"hidden",onClick:function(){return E(!1)}},"Collapse"),r.a.createElement("div",{id:"draft_toolbar",className:p?"":"hidden"},o.type>2&&r.a.createElement("input",{type:"file",id:"file",name:"file",ref:G,accept:".jpg,.jpeg,.png,.bmp,.gif",onChange:function(e){return B(e)}}),o.type>2&&r.a.createElement("button",{id:"select_file",onClick:function(){G&&G.current&&G.current.click()}},I),r.a.createElement("input",{type:"checkbox",name:"is_anonymous",checked:k,onChange:function(){return C(!k)}}),r.a.createElement("label",null,"Anonymous"),r.a.createElement("input",{type:"checkbox",name:"is_private",checked:U,onChange:function(){return P(!U)}}),r.a.createElement("label",null,"Private"),!F&&r.a.createElement("button",{onClick:function(){return function(){return H.apply(this,arguments)}()}},"Send"),F&&r.a.createElement("button",{disabled:!0},"Send")))}n(27);function C(e){var t=Object(a.useState)(e.value),n=Object(s.a)(t,1)[0],c=Object(a.useState)(e.value.length),o=Object(s.a)(c,1)[0],l=Object(a.useState)(!1),u=Object(s.a)(l,2),i=u[0],m=u[1],d=Object(a.useState)(0),p=Object(s.a)(d,2),b=p[0],E=p[1];if(Object(a.useEffect)((function(){document.body.style.overflow=i?"hidden":"auto";var e=document.getElementById("lightbox");e&&(e.style.display=i?"block":"none")}),[i]),!n||0===o)return null;function g(e){var t=b+e;t<0&&(t+=o),t>=o&&(t-=o),E(t)}return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"attachments"},n.map((function(e,t){return r.a.createElement("img",{key:t,src:f+e.thumbnail,alt:"",onClick:function(){E(t),m(!0)}})}))),i&&r.a.createElement("div",{id:"lightbox",className:"lightbox"},r.a.createElement("span",{className:"close cursor",onClick:function(){return m(!1)}},"\xd7"),r.a.createElement("img",{src:f+n[b].url,alt:"",onClick:function(){return g(1)}}),o>0&&r.a.createElement(r.a.Fragment,null,r.a.createElement("a",{href:"#",className:"prev",onClick:function(){return g(-1)}},"\u276e"),r.a.createElement("a",{href:"#",className:"next",onClick:function(){return g(1)}},"\u276f"))))}n(28);function N(e){var t=Object(a.useContext)(j),n=Object(a.useContext)(w),c=Object(a.useRef)(!0),o=Object(a.useState)(e.op),l=Object(s.a)(o,2),u=l[0],i=l[1],m=Object(a.useState)(0),d=Object(s.a)(m,2),g=d[0],h=(d[1],Object(a.useState)(!1)),v=Object(s.a)(h,2),O=v[0],y=v[1],S=Object(a.useState)(new Array),k=Object(s.a)(S,2),C=k[0],N=k[1],P=Object(a.useState)(-1),_=Object(s.a)(P,2),I=_[0],M=_[1],L=Object(a.useState)(-1),R=Object(s.a)(L,2),J=R[0],A=R[1],q=Object(a.useState)(0),T=Object(s.a)(q,2),F=T[0],z=T[1],G=Object(a.useState)(0),B=Object(s.a)(G,2),W=B[0],H=B[1],$=Object(a.useState)(),Y=Object(s.a)($,2),Z=Y[0],K=Y[1],Q=Object(a.useState)(!1),V=Object(s.a)(Q,2),X=V[0],ee=V[1],te=Object(a.useState)({uid:-1,current:0,total:0,op:0,setDestUrl:K}),ne=Object(s.a)(te,2),ae=ne[0],re=ne[1],ce=Object(a.useState)(1),oe=Object(s.a)(ce,2),le=oe[0],ue=oe[1];function se(e){var t="",a=n.user.uid;switch(e){case 1:t=f+"posts/user/"+a;break;case 2:t=f+"marks/user/"+a;break;case 3:t=f+"posts/search/"+window.location.pathname.split("/").pop();break;case 4:t=f+"trending";break;default:t=f+"posts"}return t}function ie(a){a&&(E(a.headers.get("instruction"))&&n.setUser({uid:-1,uname:"Guest",posts:0,marks:0,messages:0,type:-1}),0===e.op?function(e){e.json().then((function(e){if(e){if(t.updatePosts&&t.setUpdatePosts){if(e.posts.length>0){var n=e.posts.concat(C.slice());N(n)}else A(J+1);t.setUpdatePosts(!1)}else N(C.concat(e.posts));null!==e.hasMore&&y(e.hasMore),e.maxPid>J&&A(e.maxPid),e.minPid>0&&(I>e.minPid||I<=0)&&M(e.minPid),ee(!1)}})).catch((function(){K(""),console.error("json parse error!\n"+e.body),ee(!1)}))}(a):function(e){e.json().then((function(e){e&&(z(e.currentPage),H(e.totalPage),N(e.posts),ee(!1))})).catch((function(t){console.log("Cannot parse paged post from: "+e),ee(!1)}))}(a))}function me(e){ee(!1),console.error(e)}function de(e){var t,n;window.confirm("Confirm to delete it?")&&(t=function(t){return pe(e)},n=be,fetch(f+"posts/"+e,{credentials:"include",method:"DELETE"}).then((function(e){e.ok?t(e):n(e)})).catch((function(e){n(e)})))}function fe(e){window.confirm("Confirm to report this post?")&&b(f+"report/"+e,"",(function(t){return pe(e)}),Ee)}function pe(e){var n=C.filter((function(t){return t.pid!==e}));N(n),t.setUpdateUser&&t.setUpdateUser(!0)}function be(e){alert("Delete post error: "+e)}function Ee(e){e.text().then((function(e){return alert(e)}))}return Object(a.useEffect)((function(){t.updatePosts&&K(f+"posts?max="+J)}),[t.updatePosts]),Object(a.useEffect)((function(){c.current?c.current=!1:function(){if(N(new Array),y(!1),M(-1),A(-1),e.op!==u)return void i(e.op);var t=se(u);t===Z?ee(!0):K(t)}()}),[e]),Object(a.useEffect)((function(){var e=se(u);4===u&&(console.log("trending days: ",le),e+="?days="+le,console.log(e)),K(e)}),[u,le]),Object(a.useEffect)((function(){Z&&ee(!0)}),[Z]),Object(a.useEffect)((function(){n.user.uid<=0&&(1===u||2===u)?ee(!1):X&&Z&&p(Z,ie,me)}),[X]),Object(a.useEffect)((function(){var e={uid:n.user.uid,current:F,total:W,op:u,setDestUrl:K};re(e)}),[u,F,W,n]),r.a.createElement("div",{id:"post_list"},4===u&&r.a.createElement(D,{value:le,setDays:ue}),0===u&&g>0&&r.a.createElement("button",{id:"btn_loadnew"},"Load ",g," new posts"),C.map((function(e){return r.a.createElement("div",{className:"post",key:e.pid},r.a.createElement(U,{value:e,onDelete:de,onReport:fe,key:e.pid}),r.a.createElement("hr",null))})),X&&0===u&&r.a.createElement("div",{className:"loading-img"},r.a.createElement("img",{src:"/images/loading.svg",alt:"loading",width:"100px"})),!X&&0===C.length&&r.a.createElement("div",{className:"center"},r.a.createElement("h3",null,"No posts found.")),O&&J>0&&!X&&r.a.createElement("button",{id:"btn_loadmore",onClick:function(){K(f+"posts?min="+I)}},"Load More"),u>0&&!X&&r.a.createElement(x,{value:ae}))}function x(e){var t=Object(a.useState)(e.value),n=Object(s.a)(t,2),c=n[0],o=n[1],l=Object(a.useState)([]),u=Object(s.a)(l,2),i=u[0],m=u[1];function d(e){return e!==c.current?r.a.createElement("a",{key:e,onClick:function(){return function(e){if(e<0||e>c.total)return;var t="";switch(c.op){case 1:t=f+"posts/user/"+c.uid+"?page="+e;break;case 2:t=f+"marks/user/"+c.uid+"?page="+e}c.setDestUrl(t)}(e)}},"\xa0",e,"\xa0"):r.a.createElement("span",{key:e},"\xa0",e,"\xa0")}return Object(a.useEffect)((function(){o(e.value)}),[e]),Object(a.useEffect)((function(){c.total<=0?m([]):m(function(e,t){for(var n=[],a=e,r=e,c=0;c<2;c++)a-1>0?a--:r+1<=t&&r++,r+1<=t?r++:a-1>0&&a--;for(var o=a;o<=r;o++)n.push(o);return n}(c.current,c.total))}),[c]),r.a.createElement("div",{id:"page_no"},i.map((function(e){return d(e)})))}function U(e){var t=e.value,n=Object(a.useContext)(j),c=Object(a.useState)(!1),o=Object(s.a)(c,2),l=(o[0],o[1]),u=Object(a.useState)(!1),i=Object(s.a)(u,2),m=i[0],d=i[1],b=Object(a.useState)(t.comments),E=Object(s.a)(b,2),g=E[0],h=E[1],v=Object(a.useState)(t.marked),O=Object(s.a)(v,2),y=O[0],w=O[1],S=Object(a.useState)(t.attachments),k=Object(s.a)(S,1)[0];function N(e){n.setUpdateUser&&n.setUpdateUser(!0),w(!y)}function x(e){e.text().then((function(e){return alert(e)}))}return null===t||void 0===t?null:r.a.createElement("div",{className:"post_entry",onMouseEnter:function(){return l(!0)},onMouseLeave:function(){return l(!1)}},r.a.createElement("div",{className:"author"},t.uname," said:"),r.a.createElement("div",{className:"content"},t.content),k&&r.a.createElement(C,{value:k}),r.a.createElement("div",{className:"foot"},r.a.createElement("span",null,function(e){var t=(new Date).getTime()/1e3-e;return t<60?"just now":t<3600?Math.floor(t/60)+" mins ago":t<86400?Math.floor(t/60/60)+" hours ago":t<31536e3?Math.floor(t/24/60/60)+" days ago":new Date(1e3*e).toLocaleString()}(t.ctime)),r.a.createElement("span",{className:"toolbar"},!t.owner&&r.a.createElement("a",{onClick:function(){e.onReport(t.pid)}},"Report"),"\xa0",t.owner&&r.a.createElement("a",{onClick:function(){e.onDelete(t.pid)}},"Delete"),"\xa0",r.a.createElement("a",{onClick:function(){return function(){var e=y?"unmark":"mark";p(f+"marks?pid="+t.pid+"&action="+e,N,x)}()}},y?"Marked":"Mark"),"\xa0",r.a.createElement("a",{onClick:function(){d(!m)}},"Comments(",g,")"))),r.a.createElement(P,{value:t,show:m,onComment:function(){h(g+1)}}))}function P(e){var t=e.value,n=e.show,c=Object(a.useContext)(w),o=Object(a.useState)(new Array),l=Object(s.a)(o,2),u=l[0],i=l[1],m=Object(a.useState)(""),d=Object(s.a)(m,2),E=d[0],g=d[1],h=Object(a.useState)(!1),v=Object(s.a)(h,2),O=v[0],j=v[1];if(Object(a.useEffect)((function(){!n||t.comments<=0||p(f+"comments/"+t.pid,y,S)}),[n]),Object(a.useEffect)((function(){O?function(){if(0===E.trim().length)return alert("No content in comment area to send."),void j(!1);var e={pid:t.pid?t.pid:-1,uid:c.user.uid,uname:c.user.uname,content:E,ctime:new Date};b(f+"comments/"+t.pid,JSON.stringify(e),k,C)}():g("")}),[O]),!n||!t)return null;function y(e){e.json().then((function(e){null!==e&&i(e.comments.slice())})).catch((function(e){console.log("Cannot parse comments response.")}))}function S(e){console.error(e)}function k(t){t.json().then((function(t){var n=u.slice().concat(t);i(n),j(!1),e.onComment()}))}function C(e){j(!1),alert(e)}return r.a.createElement("div",{className:"comment"},u.map((function(e){return r.a.createElement("p",{key:e.cid},e.content," --by ",e.uname)})),r.a.createElement("textarea",{name:"comment",onChange:function(e){g(e.target.value)},value:E}),!O&&r.a.createElement("button",{onClick:function(){return j(!0)}},"Send"),O&&r.a.createElement("button",{disabled:!0},"Send"))}function D(e){var t=Object(a.useState)(e.value),n=Object(s.a)(t,2),c=n[0],o=n[1],l=Object(a.useState)(!0),u=Object(s.a)(l,2),i=u[0],m=u[1];return Object(a.useEffect)((function(){i?m(!1):e.setDays(c)}),[c]),r.a.createElement("div",{className:"trending_header"},r.a.createElement("p",{className:"trending_title"},"Trending Posts"),r.a.createElement("div",{className:"options"},r.a.createElement("label",null,"Date range: "),r.a.createElement("select",{onChange:function(e){return o(parseInt(e.target.value))},value:c.toString()},r.a.createElement("option",{value:"1"},"One day"),r.a.createElement("option",{value:"7"},"One week"),r.a.createElement("option",{value:"30"},"one month"))),r.a.createElement("hr",null))}n(29);function _(){var e=Object(a.useContext)(w),t=Object(a.useState)(e.user),n=Object(s.a)(t,2),c=n[0],o=n[1],u=Object(a.useState)(c.uname),i=Object(s.a)(u,2),m=i[0],d=i[1],E=Object(a.useState)(0),v=Object(s.a)(E,2),O=v[0],j=v[1],y=Object(a.useState)(!1),S=Object(s.a)(y,2),k=S[0],C=S[1],N=Object(a.useRef)(null),x=Object(a.useRef)(null),U=Object(a.useRef)(null),P=Object(a.useRef)(null);function D(t){t.json().then((function(t){e.setUser(t),h(t)})).catch((function(){console.log("Cannot parse json!\n"+t)}))}function _(e){e.text().then((function(e){alert(e),d(c.uname)}))}function I(e){e.text().then((function(e){e.includes("Success")?(g(),window.location.href="/"):alert("Logout failed, please try again.")})).catch((function(){alert("Logout failed, please try again.")}))}function M(){alert("Logout failed, please try again.")}return Object(a.useEffect)((function(){var e=document.getElementById("login-dialog");e&&(e.style.display=O>0?"block":"none")}),[O]),Object(a.useEffect)((function(){o(e.user)}),[e]),Object(a.useEffect)((function(){d(c.uname)}),[c]),r.a.createElement("div",{className:"aside"},r.a.createElement("div",{className:"panel"},r.a.createElement("p",null),!k&&r.a.createElement("div",{id:"nickname"},m),k&&r.a.createElement("input",{value:m,onChange:function(e){d(e.target.value)}}),c.uid>0&&r.a.createElement("button",{id:"btn_change_name",onClick:function(){return function(){if(k&&m!==c.uname){var e={uname:m};b(f+"user/"+c.uid+"/uname",JSON.stringify(e),D,_)}C(!k)}()}},k?"Submit":"Change"),r.a.createElement("hr",null),r.a.createElement("ul",null,r.a.createElement("li",null,"Posts: ",c.posts>0?r.a.createElement(l.b,{to:"/posts"},c.posts):0),r.a.createElement("li",null,"Marks: ",c.marks>0?r.a.createElement(l.b,{to:"/marks"},c.marks):0),r.a.createElement("li",null,"Messages: ",c.messages>0?c.messages:0)),r.a.createElement("hr",null),r.a.createElement("div",{className:"center"},c.uid>0&&r.a.createElement("button",{id:"button_logout",onClick:function(){window.confirm("Confirm to log out?")&&p(f+"user/logout",I,M)}},"Logout"),c.uid<=0&&r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{className:"btn_login",onClick:function(){return j(1)}},"Log in"),r.a.createElement("button",{className:"btn_login",onClick:function(){return j(2)}},"Sign up")))),r.a.createElement(L,null));function L(){return r.a.createElement("div",{id:"login-dialog",className:"login-dialog"},r.a.createElement("div",{className:"dialog-content"},2===O?r.a.createElement(q,null):r.a.createElement(A,null)))}function R(){if(!N||!N.current||!N.current.value)return alert("Empty email not allowed!"),"";var e=N.current.value;return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?e:(alert("Invalid email input!"),"")}function J(e){if(!x||!x.current||!x.current.value)return alert("Empty password not allowed!"),"";var t=x.current.value;return 1!==e||function(e){if(!U||!U.current||!U.current.value)return alert("Empty repeat password not allowed!"),!1;var t=U.current.value;if(e!==t)return alert("Password and repeat password not match!"),!1;return!0}(t)?/^\S{8,64}$/.test(t)?/\d+/.test(t)&&/[a-zA-Z]+/.test(t)?t:(alert("Password must have at least one digit and one character!"),""):(alert("Password must be longer than 8!"),""):""}function A(){var t=Object(a.useState)(!1),n=Object(s.a)(t,2),c=n[0],o=n[1];function l(){var e=function(){var e={uid:-1,uname:"Guest",posts:0,marks:0,messages:0,type:-1},t=R();if(!t)return e;var n=J(0);return n?(e.email=t,e.password=n,e):e}();e.email&&e.password&&(o(!0),b(f+"user/login",JSON.stringify(e),u,i))}function u(t){o(!1),t.json().then((function(t){e.setUser(t),h(t),j(0)})).catch((function(){console.log("Cannot parse json!\n"+t)}))}function i(e){o(!1),alert("login failed")}return r.a.createElement("div",{className:"box"},r.a.createElement("a",{className:"close",onClick:function(){return j(0)}},"\xd7"),r.a.createElement("h2",null,"Login"),r.a.createElement("input",{type:"email",ref:N,name:"email",placeholder:"Email",autoComplete:"off",required:!0}),r.a.createElement("input",{type:"password",ref:x,name:"passwd",placeholder:"Password",required:!0}),r.a.createElement("div",{className:"btns"},!c&&r.a.createElement("button",{onClick:function(){return l()}},"Submit"),c&&r.a.createElement("button",{disabled:!0,className:"disabled"},"Submit"),r.a.createElement("button",{onClick:function(){return j(2)}},"Sign up")),r.a.createElement("div",{className:"other"},r.a.createElement("a",{href:"#"},"Forget your password?")))}function q(){var e=Object(a.useState)(!1),t=Object(s.a)(e,2),n=t[0],c=t[1];function o(){var e=function(){var e={uid:-1,uname:"Guest",posts:0,marks:0,messages:0,type:-1},t=R();if(!t)return e;var n=J(1);if(!n)return e;e.email=t,e.password=n,P&&P.current&&P.current.value?e.uname=P.current.value:e.uname="Anonymous";return e}();e.email&&e.password&&(c(!0),b(f+"user/register",JSON.stringify(e),l,u))}function l(){c(!1),alert("Register successfully!"),j(1)}function u(){c(!1),alert("Register failed!")}return r.a.createElement("div",{className:"box"},r.a.createElement("a",{className:"close",onClick:function(){return j(0)}},"\xd7"),r.a.createElement("h2",null,"Sign up"),r.a.createElement("input",{title:"Fake email is allowed if you do not need advanced features.",type:"email",ref:N,name:"email",placeholder:"Email",autoComplete:"off",required:!0}),r.a.createElement("input",{title:"No less than 8 and has at least one digit and one character.",type:"password",ref:x,name:"password",placeholder:"Password",required:!0}),r.a.createElement("input",{title:"Same with password.",type:"password",ref:U,name:"repeat_passwd",placeholder:"Repeat password",required:!0}),r.a.createElement("input",{type:"text",ref:P,name:"nickname",autoComplete:"off",placeholder:"Nickname (optional)"}),r.a.createElement("div",{className:"btns"},n&&r.a.createElement("button",{disabled:!0,className:"disabled"},"Submit"),!n&&r.a.createElement("button",{onClick:function(){return o()}},"Submit"),r.a.createElement("button",{onClick:function(){return j(1)}},"Login")))}}function I(e){var t=Object(a.useState)(e.op),n=Object(s.a)(t,2),c=n[0],o=n[1];return Object(a.useEffect)((function(){var t=e.op;void 0===t||t>4||t<0?console.error("Invalid op value: "+t):o(e.op)}),[e]),r.a.createElement("main",null,r.a.createElement("div",{id:"wrapper"},r.a.createElement("article",null,0===c&&r.a.createElement(k,null),r.a.createElement(N,{op:c})),r.a.createElement(_,null)))}n(35);function M(){var e=Object(a.useContext)(w),t=Object(a.useState)(e.user),n=Object(s.a)(t,1)[0],c=Object(a.useState)(n.uname),o=Object(s.a)(c,2),l=o[0],u=o[1],i=Object(a.useState)(""),m=Object(s.a)(i,2),d=m[0],p=m[1],E=Object(a.useState)(""),g=Object(s.a)(E,2),v=g[0],O=g[1],j=Object(a.useState)(""),y=Object(s.a)(j,2),S=y[0],k=y[1],C=Object(a.useState)(!1),N=Object(s.a)(C,2),x=N[0],U=N[1];function P(e,t){t(e.target.value)}function D(e){return!!e&&(!!/^\S{8,64}$/.test(e)&&!(!/\d+/.test(e)||!/[a-zA-Z]+/.test(e)))}function _(e){e.text().then((function(e){U(!1),alert(e)}))}function I(t){t.json().then((function(t){e.setUser(t),h(t),U(!1),alert("Done")}))}function M(e){U(!1),u(n.uname),alert("Error happened.")}return r.a.createElement("div",{id:"setting"},r.a.createElement("h3",null,n.email),r.a.createElement("label",null,"Nickname:"),r.a.createElement("input",{value:l,onChange:function(e){return P(e,u)}}),r.a.createElement("div",null,!x&&r.a.createElement("button",{onClick:function(){return function(){if(l!==n.uname){var e={uname:l};U(!0),b(f+"user/"+n.uid+"/uname",JSON.stringify(e),I,M)}else alert("Same with old nickname.")}()}},"Submit"),x&&r.a.createElement("button",{disabled:!0},"Submit"),r.a.createElement("div",{className:"tooltip"},"Nickname rules?",r.a.createElement("span",{className:"tooltiptext"},"1. No longer than 32 characters;",r.a.createElement("br",null),"2. Only alphanumeric, underscore and blank space allowed."))),r.a.createElement("hr",null),r.a.createElement("label",null,"Old password:"),r.a.createElement("input",{type:"password",value:d,onChange:function(e){return P(e,p)}}),r.a.createElement("label",null,"New password:"),r.a.createElement("input",{type:"password",value:v,onChange:function(e){return P(e,O)}}),r.a.createElement("label",null,"Repeat new password:"),r.a.createElement("input",{type:"password",value:S,onChange:function(e){return P(e,k)}}),r.a.createElement("div",null,!x&&r.a.createElement("button",{onClick:function(){return function(){if(D(d)&&D(v)&&D(S))if(v===S){var e={oldPassword:d,newPassword:v};U(!0),b(f+"user/"+n.uid+"/password",JSON.stringify(e),_,_)}else alert("New passwords not match.");else alert("Password format error, please check your input.")}()}},"Submit"),x&&r.a.createElement("button",{disabled:!0},"Submit"),r.a.createElement("div",{className:"tooltip"},"Password rule?",r.a.createElement("span",{className:"tooltiptext"},"1. Must be longer than 8; ",r.a.createElement("br",null),"2. Has at least one character and one digit. 3. Whitespace is not allowed."))),r.a.createElement("hr",null),r.a.createElement("label",null,"Account setting:"),r.a.createElement("p",null),r.a.createElement("div",null,r.a.createElement("button",{disabled:!0},"Export posts"),r.a.createElement("button",{className:"right",disabled:!0},"Validate Email")))}function L(){return r.a.createElement("div",null,r.a.createElement("div",{className:"title"},"Cookie Policy"),r.a.createElement("div",{className:"subtitle"},"About Cookie"),r.a.createElement("p",null,"A cookie is a small piece of text stored in your computer which helps the website to remember information about your visit. It could help to improve the experience of using the web."),r.a.createElement("div",{className:"subtitle"},"How Masq uses cookies "),r.a.createElement("p",null,"Only two cookies are used in Masq.xyz: "),r.a.createElement("li",null,r.a.createElement("span",{className:"code"},"JSESSIONID"),": used to remember the current session between your computer and our server. This cookie expires after 20 minutes of the last activity between you and the website. "),r.a.createElement("li",null,r.a.createElement("span",{className:"code"},"u"),": used to remember whether you have logged in. It lives for 7 days so you don't need to re-login within that period as long as you use the same browser on the same device. "),r.a.createElement("p",null,"Masq.xyz doen's not use any of its cookies to track your information across sites."),r.a.createElement("div",{className:"subtitle"},"What if I turn of cookies"),r.a.createElement("p",null,"Everything still works fine except you cannot log in or use features that required login, such as changing setting and search."))}n(36);function R(){var e=Object(a.useContext)(w),t=Object(a.useState)(""),n=Object(s.a)(t,2),c=n[0],o=n[1],u=Object(a.useState)(""),i=Object(s.a)(u,2),m=i[0],d=i[1],b=Object(a.useState)(!0),E=Object(s.a)(b,2);E[0],E[1];function h(e){e.text().then((function(e){e.includes("Success")?(g(),window.location.href="/"):alert("Logout failed, please try again.")})).catch((function(){alert("Logout failed, please try again.")}))}function v(){alert("Logout failed, please try again.")}return Object(a.useEffect)((function(){c&&d("/search/"+c)}),[c]),r.a.createElement("header",null,r.a.createElement("nav",null,r.a.createElement("div",{id:"nav_logo"},"Masq"),r.a.createElement("div",{id:"nav_items"},r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement(l.b,{to:"/"},"Home")),r.a.createElement("li",null,r.a.createElement(l.b,{to:"/trending"},"Trending")),r.a.createElement("li",null,r.a.createElement(l.b,{to:"/setting"},"Setting")),r.a.createElement("li",null,r.a.createElement("a",{onClick:function(){!e.user.uid||e.user.uid<=0?alert("You have not logged in."):window.confirm("Confirm to log out?")&&p(f+"user/logout",h,v)}},"Quit")),r.a.createElement("li",null,r.a.createElement(l.b,{id:"search",to:m})))),r.a.createElement("div",{id:"nav_search"},r.a.createElement("input",{id:"search",autoComplete:"company",placeholder:"Search",value:c,onChange:function(e){return function(e){var t=e.target.value;o(t)}(e)},onKeyPress:function(t){return function(t){var n=t.keyCode||t.which;if(13===n&&e.user.uid>0){var a=document.getElementById("search");a&&a.click(),o("")}else 13===n&&alert("Only logged user can search for posts.")}(t)}}))))}function J(){var e=(new Date).getFullYear(),t=e>2020?"2020-"+e:2020,n=Object(a.useState)(void 0===O.a.get("u")),c=Object(s.a)(n,2),o=c[0],l=c[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement("footer",null,"Copyright ","Masq.xyz"," ",t," test version."),o&&r.a.createElement(A,{onClose:function(){return l(!1)}}))}function A(e){var t=e.onClose;return r.a.createElement("div",{id:"foot-note"},r.a.createElement("span",{className:"close",onClick:function(){return t()}},"\xd7"),r.a.createElement("br",null),"This website is in test version. All data and inputs may be cleared.",r.a.createElement("br",null),"We use cookie. Check our ",r.a.createElement(l.b,{to:"/about/cookie",onClick:function(){return t()}},"cookie policy")," for more information.")}n(37);o.a.render(r.a.createElement(y,null,r.a.createElement(S,null,r.a.createElement(l.a,null,r.a.createElement(R,null),r.a.createElement(u.c,null,r.a.createElement(u.a,{exact:!0,path:"/",component:function(){return r.a.createElement(I,{op:0})}}),r.a.createElement(u.a,{exact:!0,path:"/posts",component:function(){return r.a.createElement(I,{op:1})}}),r.a.createElement(u.a,{exact:!0,path:"/marks",component:function(){return r.a.createElement(I,{op:2})}}),r.a.createElement(u.a,{exact:!0,path:"/search/:keyword",component:function(){return r.a.createElement(I,{op:3})}}),r.a.createElement(u.a,{exact:!0,path:"/trending",component:function(){return r.a.createElement(I,{op:4})}}),r.a.createElement(u.a,{exact:!0,path:"/setting",component:function(){var e=Object(a.useContext)(w);return r.a.createElement("main",null,r.a.createElement("div",{id:"wrapper"},e.user.uid>0&&r.a.createElement(M,null),e.user.uid<=0&&r.a.createElement("div",null,"Sorry, you haven't logged in.")))}}),r.a.createElement(u.a,{exact:!0,path:"/about/:type",component:function(){var e=Object(u.f)().type;return console.log("type is "+e),r.a.createElement("main",null,r.a.createElement("div",{id:"wrapper"},r.a.createElement("article",null,"cookie"===e&&r.a.createElement(L,null))))}}),r.a.createElement(u.a,{component:function(){return r.a.createElement("main",null,r.a.createElement("div",{id:"wrapper"},"Page not found!"))}})),r.a.createElement(J,null)),r.a.createElement("div",{className:"hidden"},r.a.createElement("input",{type:"text"}),r.a.createElement("input",{type:"password"})))),document.getElementById("root"))}},[[20,1,2]]]);
//# sourceMappingURL=main.2019407f.chunk.js.map