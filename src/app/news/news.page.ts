import { Component, OnInit } from "@angular/core";
import { NewsService } from "../services/news.service";
import { Router } from "@angular/router";
import { Observable, merge } from "rxjs";
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: "app-news",
  templateUrl: "./news.page.html",
  styleUrls: ["./news.page.scss"],
})
export class NewsPage implements OnInit {
  constructor(private newsService: NewsService, private router: Router) {}

  data: any[] = [];
  tempData: any;
  numberToLoad: number = 0;
  ngOnInit(): void {
    this.numberToLoad = 0;
    this.newsService.getData("public?s=0&l=20&_=1677560254553").subscribe((res) => {
      this.data = res;
      console.log(this.data);
    });
  }

  onGoToNewsDetail(article) {
    this.newsService.currentArticle = article;
    this.router.navigate(["/newsdetail"]);
  }

  loadMoreNews() {
    this.numberToLoad += 20;
    this.newsService.getData("public?s="+`${this.numberToLoad}` + "&l=20&_=1677560254553").subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        this.data.push(res[i]);
      }
    })
    console.log(this.data);
  }

  onIonInfinite(ev) {
    this.loadMoreNews();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

}