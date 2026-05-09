import { NgModel } from '@angular/forms';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/main/home/home.component';
import { StoreComponent } from './pages/products/store/store.component';
import { AboutComponent } from './pages/main/about/about.component';
import { ContactComponent } from './pages/main/contact/contact.component';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { CartComponent } from './pages/products/cart/cart.component';
import { LikedComponent } from './pages/products/liked/liked.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { ProfileSettingsComponent } from './pages/account/profile-settings/profile-settings.component';
import { UserOrdersComponent } from './pages/account/user-orders/user-orders.component';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { ChangeEmailComponent as AccountVerifyEmailComponent } from './pages/account/change-email/change-email.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component'; 

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'store', component: StoreComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'verify-email', component: VerifyEmailComponent, canActivate: [guestGuard] },
    
    { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'settings', component: ProfileSettingsComponent },
            { path: 'orders', component: UserOrdersComponent },
            { path: 'change-password', component: ChangePasswordComponent },
            { path: 'verify-email', component: AccountVerifyEmailComponent }
        ]
    },
    { path: 'cart', component: CartComponent },
    { path: 'liked', component: LikedComponent },

    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
];
