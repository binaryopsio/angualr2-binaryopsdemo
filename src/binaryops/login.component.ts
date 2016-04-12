import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {BinaryopsService} from  'angular2-binaryops/client';
import {Router}              from 'angular2/router';

@Component({
  selector: 'bos-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class LoginComponent {
  username: string;
  password: string;
  _binaryopsService: BinaryopsService;
  _router: Router;
  constructor(binaryopsService: BinaryopsService, router: Router) {
    this._binaryopsService = binaryopsService;
    this._router = router;
  }

  /*
   * @param newname  any text as input.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  doLogin() {
    console.log('Going to login');
    this._binaryopsService.login(this.username, this.password).subscribe(
        data => {
        console.log('Login OK');
        //this.nav.push(BlogListPage, {});
        this._router.navigate(['Home', {}]);
      },
      err => {

        console.log('Login Error: ' + err);
      },
      () => console.log('Login complete')
    );
    return;
  }
}
