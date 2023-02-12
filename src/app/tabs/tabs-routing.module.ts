import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'news',
        children: [
          {
              path: '', 
              loadChildren: () => import('../news/news.module').then( m => m.NewsPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
              path: '',                 
              loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
              
          }
        ]
      }
    ]
  }, 
  {
    path: '',
    redirectTo: '/tabs/tabs/home',
    pathMatch: 'full'
  }
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}