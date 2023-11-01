import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PokemonService } from 'src/app/services/pokemon.service';
import { faFileLines, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { AppDB } from 'src/app/services/db';


@Component({
  selector: 'app-poke-list',
  templateUrl: './poke-list.component.html',
  styleUrls: ['./poke-list.component.css']
})
export class PokeListComponent implements OnInit{
  faFileLines = faFileLines;
  faSquarePlus = faSquarePlus;
  displayedColumns: string[] = ['id', 'image', 'name', 'details', 'add'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  originalData: any[] = [];
  pageSizeOptions: number[] = [5, 8, 10, 12, 15, 20, 50];
  pageSize = 8;
  filterValue = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pokemonService: PokemonService,
    private appDB: AppDB,
  ) {}

  ngOnInit(): void {
    this.pokemonService.getAllPokemonData().subscribe({
      next: (data) => {
        this.originalData = data.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          image: (pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default)
        }));
        this.dataSource = new MatTableDataSource(this.originalData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.filterValue.toLowerCase().trim();

    if (!filterValue) {
      this.dataSource.data = this.originalData;
    } else {
      this.dataSource.data = this.originalData.filter((pokemon) => {
        return (
          pokemon.name.toLowerCase().includes(filterValue) ||
          pokemon.id.toString().toLowerCase().includes(filterValue)
        );
      });
    }
    this.dataSource.paginator.firstPage();
  }

  onAddPokemon(pokemon: any){
    this.appDB.addPokemonToTracked({
      userId: JSON.parse(localStorage.getItem('logged')).id,
      imageUrl: pokemon.image,
      pokeId: pokemon.id,
      pokeName: pokemon.name,
    });
  }
}

