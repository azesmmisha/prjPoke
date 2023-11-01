import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PokemonService } from './services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { AppDB } from './services/db';
import { PokeListComponent } from './components/poke-list/poke-list.component';
import { TrackedPokemonsComponent } from './components/tracked-pokemons/tracked-pokemons.component';
import { PokeDetailsComponent } from './components/poke-details/poke-details.component';
// angular material
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'poke-list', pathMatch: 'full' },
      { path: 'poke-list', component: PokeListComponent },
      { path: 'tracked-pokemons', component: TrackedPokemonsComponent },
      { path: 'poke-list/:id', component: PokeDetailsComponent },
      { path: 'tracked-pokemons/:id', component: PokeDetailsComponent },
    ]
  },
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PokeListComponent,
    TrackedPokemonsComponent,
    PokeDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    // angular material modules
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [AppDB, PokemonService],
  bootstrap: [AppComponent]
})
export class AppModule {  }
