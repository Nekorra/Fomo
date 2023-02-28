import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.page.html',
  styleUrls: ['./newsdetail.page.scss'],
})
export class NewsdetailPage implements OnInit {
  article: any;
  constructor(
    private newsService: NewsService, ) { }

  ngOnInit() {
		this.article = this.newsService.currentArticle;
	}

  async redirect() {
    await Browser.open({url: `${this.article.object.ucdEdusModel.url}`})
  }

}
