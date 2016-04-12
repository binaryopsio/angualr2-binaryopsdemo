import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {BinaryopsService} from  'angular2-binaryops/client';
//import {Alert} from 'ng2-bootstrap/ng2-bootstrap';

interface PostComment {
  postid: string;
  content : string;
  _id: string;
};

interface Post {
  _id: string;
  title: string;
  postid_comment: Array<Post>;
}

@Component({
  selector: 'sd-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class HomeComponent {
  newName: string;
  _binaryopsService: BinaryopsService;
  _blogs = [];
  _posts = [];
  _selectedPost : Post;
  _selectedBlogID : string;
  _newComment : string;
  constructor( binaryopsService: BinaryopsService) {
    this._binaryopsService = binaryopsService;
    this._selectedPost = {_id:'', title:'', postid_comment:[]};
  }

  ngOnInit() {
    //get the blog list
    this._binaryopsService.searchDocs('blog','').subscribe(
      data => {this._blogs = data.data;
          this._selectedBlogID = this._blogs[0]._id;
          this.selectBlog({});
      },
      err => {console.log('Error: ' + err);
              //this.showApiError(err);
            },
      () => console.log('SearchDocs complete')
    );
  }

  selectBlog(evt) {
    console.log('Selected: ' + this._selectedBlogID);
    this._binaryopsService.searchDocs('post','_connect=comment.postid&blogid='+this._selectedBlogID).subscribe(
      data => {this._posts = data.data;
        if(this._posts.length > 0) {
        this.onSelectPost(this._posts[0]);
      }
              },
      err => console.log('Error: ' + err),
      () => console.log('SearchDocs complete')
    );

  }

  onSelectPost(post) {
    this._selectedPost = post;
    console.log(JSON.stringify(post));
  }

  addComment() {
    console.log('going to add a comment: ' + this._newComment);
    let inscmt : PostComment;
    inscmt = {};
          inscmt.content = this._newComment;
          inscmt.postid = this._selectedPost._id;
          this._binaryopsService.insert('comment',inscmt).subscribe(
              data => {console.log(data);
                this._selectedPost.postid_comment.push(data);
              },
              err => console.log('Error: ' + JSON.stringify(err)),
              () => {this._newComment = undefined;}
            );
    }



  deleteOneComment(cmt) {
    console.log('Deleting: ' + JSON.stringify(cmt));
    this._binaryopsService.delete('comment', cmt).subscribe(
      data => {console.log(JSON.stringify(data));
         let i = this._selectedPost.postid_comment.indexOf(cmt);
         this._selectedPost.postid_comment.splice(i,1);
      },
      err => console.log('Error: ' + err),
      () => console.log('Delete complete')
    );
  }

  // /*
  //  * @param newname  any text as input.
  //  * @returns return false to prevent default form submit behavior to refresh the page.
  //  */
  // addName(): boolean {
  //   this.nameListService.add(this.newName);
  //   this.newName = '';
  //   return false;
  // }
}
