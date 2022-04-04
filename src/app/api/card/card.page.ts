import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  multiverseid = null
  card:any = []
  //loadRedy = false
  constructor(
    private activeRouter: ActivatedRoute,
    private service: ApiService
  ) {}

  ngOnInit() {
    this.multiverseid = this.activeRouter.snapshot.paramMap.get("multiverseid");
    console.log(this.multiverseid)

    this.service.getCard(this.multiverseid).then((result) => {
      this.card = result.card;
      console.log(this.card)
    })
  }

}
