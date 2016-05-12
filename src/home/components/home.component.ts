import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {BinaryopsService} from  'angular2-binaryops/client';
import {Alert} from 'ng2-bootstrap/ng2-bootstrap';

interface PostComment {
    postid: string;
    content : string;
    _id: string;
};

interface Post {
    _id: string;
    title: string;
    comment_postid: Array<PostComment>;
    isSelected: boolean;
}

// sidestep an error where module is not locally defined.
//var module: any = module || {id: 'dummy'};

@Component({
  selector: 'sd-home',
  //moduleId: module.id,
  templateUrl: 'home/components/home.component.html',
  styleUrls: ['home/components/home.component.css'],
  directives: [ Alert, FORM_DIRECTIVES, CORE_DIRECTIVES]
})

export class HomeComponent {
  newName: string;
  _binaryopsService: BinaryopsService;
  _blogs = Array();
  _posts = Array<Post>();
  _selectedPost: Post;
  _selectedBlogID: string;
  _newComment: string;

  constructor( binaryopsService: BinaryopsService) {
    this._binaryopsService = binaryopsService;
    this._selectedPost = {_id:'', title:'', comment_postid:[], isSelected: false};
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

  selectBlog(event: any) {
    this._binaryopsService.searchDocs('post', '_connect=comment.postid&blogid=' + this._selectedBlogID).subscribe(
      data => { //we're not returning an empty array when there are no comments. We should!
              let posts = data.data;
              let p: any;
              for (p of posts) {
                p.postid_comment = p.postid_comment || [];
              }
              this._posts = posts;
                if (this._posts.length > 0) {
                    this.onSelectPost(this._posts[0]);
                }
              },
              err => console.log('Error: ' + err),
              () => console.log('SearchDocs complete')
            );
  }

  onSelectPost(post: Post) {
    this._selectedPost.isSelected = false;
    this._selectedPost = post;
    this._selectedPost.isSelected = true;
  }

  addComment() {
    let inscmt: PostComment = {_id: '',
                                content: this._newComment,
                                postid: this._selectedPost._id};

          this._binaryopsService.insert('comment', inscmt).subscribe(
              data => {console.log(data);
                  this._selectedPost.comment_postid.push(data);
              },
              err => console.log('Error: ' + JSON.stringify(err)),
              () => {this._newComment = undefined;}
            );
    }

  deleteOneComment(cmt: PostComment) {
    this._binaryopsService.delete('comment', cmt).subscribe(
      data => {
         console.log(JSON.stringify(data));
         let i = this._selectedPost.comment_postid.indexOf(cmt);
         this._selectedPost.comment_postid.splice(i, 1);
      },
      err => console.log('Error: ' + err),
      () => console.log('Delete complete')
    );
  }

}
