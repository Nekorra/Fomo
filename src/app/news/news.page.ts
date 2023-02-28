import { Component, OnInit } from "@angular/core";
import { NewsService } from "../services/news.service";
import { Router } from "@angular/router";
import { Observable, merge } from "rxjs";
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: "app-news",
  templateUrl: "./news.page.html",
  styleUrls: ["./news.page.scss"],
})
export class NewsPage implements OnInit {
  Date = new Date();
Math: any;
  constructor(
    private newsService: NewsService, 
    private router: Router,
    private loadingController: LoadingController,
    ) {}
  currentDate: any;
  data: any[] = [];
  tempData: any;
  numberToLoad: number = 0;


  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.currentDate = (new Date()).toISOString();
    this.numberToLoad = 0;
    this.newsService.getData("public?s=0&l=20&_=1677560254553").subscribe((res) => {
      this.data = res;
      loading.dismiss()

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
  }

  onIonInfinite(ev) {
    this.loadMoreNews();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  calculateDiff(date: string){
    let d2: Date = new Date();
    let d1 = Date.parse(date); //time in milliseconds
    var timeDiff = d2.getTime() - d1;
    var diff = timeDiff / 3600000;
    return Math.floor(diff);
  }

  roundNumber(n: number) {
    return Math.floor(n);
  }

}