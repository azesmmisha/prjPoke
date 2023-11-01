import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { faFolderPlus, faFolderMinus} from '@fortawesome/free-solid-svg-icons'
import { AppDB } from 'src/app/services/db';


@Component({
  selector: 'app-poke-details',
  templateUrl: './poke-details.component.html',
  styleUrls: ['./poke-details.component.css']
})
export class PokeDetailsComponent implements OnInit{
  faFolderMinus = faFolderMinus;
  faFolderPlus = faFolderPlus;
  id: number;
  pokemonData: any = {};
  pokemonSpeciesData: any = {
  };
  isTracked: number;
  displayedColumns = ['stat','base','effort'];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private appDB: AppDB,
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.id = +params.get('id');
    });
    this.pokemonService.getPokemonDataById(this.id).subscribe({
      next: (data) => {
        this.pokemonData = {
          name: data.name,
          id: data.id,
          height: data.height,
          weight: data.weight,
          imgPng: data.sprites.front_default,
          imgPngBack: data.sprites.back_default,
          imgSvg: data.sprites.other.dream_world.front_default,
          abilities: data.abilities.map((x:any) => x.ability.name),
          stats: data.stats.map((x: any) => {return {name: x.stat.name, base_stat: x.base_stat, effort: x.effort}})
        }
        this.appDB.isPokemonInTracked({userId: JSON.parse(localStorage.getItem('logged')).id, imageUrl: this.pokemonData.img, pokeId: data.id, pokeName: data.name})
          .then((response) => {
            this.isTracked = response;
          })
          .catch((error) => {console.log(error);})
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
    this.pokemonService.getPokemonSpecies(this.id).subscribe({
      next: (data) => {
        this.pokemonSpeciesData = {
          base_happiness: data.base_happiness,
          capture_rate: data.capture_rate,
          egg_groups: data.egg_groups.map((x: any) => x.name),
          growth_rate: data.growth_rate.name,
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  onAddBtn(){
    this.appDB.addPokemonToTracked({
      userId: JSON.parse(localStorage.getItem('logged')).id,
      imageUrl: this.pokemonData.imgSvg,
      pokeId: this.pokemonData.id,
      pokeName: this.pokemonData.name
    })
    .then((response)=>{this.isTracked = response})
    .catch((error) => {console.log(error)})
  }

  onDeleteBtn(){
    this.appDB.deletePokemonFromTracked(this.isTracked);
    this.isTracked = 0;
  }
}
