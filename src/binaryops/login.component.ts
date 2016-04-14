import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {BinaryopsService} from  'angular2-binaryops/client';
import {Router} from 'angular2/router';
import {Alert} from 'ng2-bootstrap/ng2-bootstrap';

// sidestep an error where module is not locally defined.
var module: any = module || {id: 'dummy'};

@Component({
  selector: 'bos-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  directives: [Alert, FORM_DIRECTIVES, CORE_DIRECTIVES]
})

export class LoginComponent {
  username: string;
  password: string;
  _binaryopsService: BinaryopsService;
  _router: Router;
  _loggingIn: boolean = false;
  _loginErrorMsg : string = undefined;
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
    this._loggingIn = true;
    this._loginErrorMsg = undefined;
    this._binaryopsService.login(this.username, this.password).subscribe(
        data => {
            console.log('Login OK');
            this._router.navigate(['Home', {}]);
          },
      err => {
        console.log('Login Error: ' + err);
        this._loginErrorMsg = err;
        this._loggingIn = false;
      },
      () => {
        console.log('Login complete');
        this._loggingIn = false;
      }
    );
    return;
  }

  noLoginInProgress() {
    return !this._loggingIn;
  }

  noLoginError() {
    return (this._loginErrorMsg === undefined);
  }
}
