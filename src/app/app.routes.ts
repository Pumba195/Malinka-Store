import { NgModel } from '@angular/forms';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { LikedComponent } from './pages/liked/liked.component';
import { authGuard } from './auth.guard';
import { UserOrdersComponent } from './pages/user-orders/user-orders.component';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'store', component: StoreComponent},
    {path: 'about', component: AboutComponent},
    {path: 'contact', component: ContactComponent},

    {path: 'profile', component: ProfileComponent},
    {path: 'cart', component: CartComponent},
    {path: 'liked', component: LikedComponent},
    { path: 'profile', 
        component: ProfileComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'settings', component: ProfileSettingsComponent },
            { path: 'orders', component: UserOrdersComponent }
        ]
    },
    {path: 'product/:id', component: ProductDetailComponent},
];
