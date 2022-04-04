import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public cards : Array<any>

  constructor(
    private apiServices: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiServices.getCards().then(result => {
      console.log(result)
      this.cards = result.cards
    })
  }

  goCard(multiverseid) {
    this.router.navigateByUrl(`card/${multiverseid}`)
  }
}
