import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faList, faSquareCheck, faListCheck} from '@fortawesome/free-solid-svg-icons'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userData: any;
  faUser = faUser; 
  faArrowRightFromBracket = faArrowRightFromBracket;
  faList = faList;
  faSquareCheck = faSquareCheck;
  faListCheck = faListCheck;

  constructor(
    private router: Router,
  ){}

  ngOnInit(): void {
    if(localStorage.getItem('logged')){
      this.userData = JSON.parse(localStorage.getItem('logged'))
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  logOut(){
    localStorage.removeItem('logged');
    this.router.navigate(['/login']);
  }
}
