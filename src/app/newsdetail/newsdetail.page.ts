import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.page.html',
  styleUrls: ['./newsdetail.page.scss'],
})
export class NewsdetailPage implements OnInit {
  article: any;
  constructor(
    private newsService: NewsService, 
    private inAppBrowser: InAppBrowser) { }

  ngOnInit() {
		this.article = this.newsService.currentArticle;
	}

  redirect() {
    this.inAppBrowser.create(`${this.article.object.ucdEdusModel.url}`);
  }

}
