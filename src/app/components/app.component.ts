import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {LoginComponent} from '../../binaryops/login.component';
import { BINARYOPS_CLIENT_PROVIDERS, BinaryopsService} from 'angular2-binaryops/client';

import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../../home/components/home.component';
import {AboutComponent} from '../../about/components/about.component';
import {NameListService} from '../../shared/services/name-list.service';

@Component({
  selector: 'sd-app',
  viewProviders: [NameListService, BINARYOPS_CLIENT_PROVIDERS],
  templateUrl: './app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
@RouteConfig([
  { path: '/',      name: 'Login',  component: LoginComponent  },
  { path: '/home',      name: 'Home',  component: HomeComponent  },
  { path: '/about', name: 'About', component: AboutComponent }
])
export class AppComponent {
  _binaryopsService: BinaryopsService;
  constructor(binaryopsService: BinaryopsService) {
    this._binaryopsService = binaryopsService;
    this._binaryopsService.setApiDetail('prod', 'bdco43', '1', '0hjh12');
  }
}
