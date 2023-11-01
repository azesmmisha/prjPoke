import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonNames(): Observable<string[]> {
    const url = `${this.baseUrl}/pokemon?offset=0&limit=100`;
    return this.http.get<any>(url).pipe(
      map((data) => data.results.map((pokemon: any) => pokemon.name))
    );
  }

  getPokemonData(name: string): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${name}`;
    return this.http.get<any>(url);
  }

  getPokemonDataById(id: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${id}`;
    return this.http.get<any>(url);
  }

  getPokemonSpecies(id: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon-species/${id}`;
    return this.http.get<any>(url);
  }

  getAllPokemonData(): Observable<any[]> {
    return this.getPokemonNames().pipe(
      switchMap((names) => {
        const requests: Observable<any>[] = names.map((name) =>
          this.getPokemonData(name)
        );
        return forkJoin(requests);
      })
    );
  }
}
