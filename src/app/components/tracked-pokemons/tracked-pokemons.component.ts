import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppDB } from 'src/app/services/db';
import { faFileLines, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { trigger, state, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-tracked-pokemons',
  templateUrl: './tracked-pokemons.component.html',
  styleUrls: ['./tracked-pokemons.component.css'],
})
export class TrackedPokemonsComponent implements OnInit{
  faFileLines = faFileLines;
  faTrashCan = faTrashCan;
  displayedColumns: string[] = ['id', 'image', 'name', 'details', 'delete'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  originalData: any[] = [];
  pageSizeOptions: number[] = [5, 8, 10, 12, 15, 20, 50];
  pageSize = 8;
  filterValue = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private appDB: AppDB){}

  ngOnInit(): void {
    this.appDB.getTrackedPokemonsByUserId(JSON.parse(localStorage.getItem('logged')).id)
    .then((trackedPokemons) => {
      this.originalData = trackedPokemons;
      this.dataSource = new MatTableDataSource(this.originalData.reverse());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  applyFilter(): void {
    const filterValue = this.filterValue.toLowerCase().trim();
    if (!filterValue) {
      this.dataSource.data = this.originalData;
    } else {
      this.dataSource.data = this.originalData.filter((pokemon) => {
        return (
          pokemon.pokeName.toLowerCase().includes(filterValue) ||
          pokemon.pokeId.toString().toLowerCase().includes(filterValue)
        );
      });
    }
    this.dataSource.paginator.firstPage();
  }

  onDelete(val: any){
    this.dataSource.data = this.dataSource.data.filter((item) => item.id !== val.id);
    this.appDB.deletePokemonFromTracked(val.id);
  }
}
