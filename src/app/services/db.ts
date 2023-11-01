import Dexie, { Table } from "dexie";


export interface IUser {
  id?: number;
  username?: string;
  email: string;
  password: string;
}

export interface ITrackedPokemon {
  id?: number;
  userId: number;
  imageUrl: string;
  pokeId: number;
  pokeName: string;
}

export class AppDB extends Dexie {
  users!: Table<IUser, number>;
  trackedPokemons!: Table<ITrackedPokemon, number>;

  constructor(){
    super('PokeDB');
    this.version(40).stores({
      users: '++id',
      trackedPokemons: '++id, [userId+pokeId]'
    });
  }

  async getEmails(){
    return (await this.users.toArray()).map(x => x.email);
  }

  async register(user: IUser): Promise<number> {
    if(!(await this.getEmails()).includes(user.email)){
      localStorage.setItem('logged', JSON.stringify({...user, id: ((await this.getEmails()).length + 1)}));
      return db.users.add(user);
    }
    alert('acc with such email exists')
    return -1;
  }

  async login(user: IUser): Promise<number> {
    const acc = (await this.users.toArray()).find(x => (x.email == user.email && x.password == user.password));
    if((await this.getEmails()).includes(user.email) && acc){
      localStorage.setItem('logged', JSON.stringify({email: user.email, password: user.password, username: acc.username, id: acc.id}));
      return user.id;
    } else if((await this.getEmails()).includes(user.email) && !acc){
      alert('password is incorrect');
      return -1;
    } else if(!(await this.getEmails()).includes(user.email)){
      alert('there is no account with such email')
      return -1;
    }
  }

  async addPokemonToTracked(pokemon: ITrackedPokemon): Promise<number> {
    const existingEntry = await db.trackedPokemons.get({ pokeId: pokemon.pokeId, userId: pokemon.userId })
    if (existingEntry) {
      alert(`${pokemon.pokeName} is already in Tracked`)
      return 0;
    }
    return (await db.trackedPokemons.add(pokemon));
  }

  async isPokemonInTracked(pokemon: ITrackedPokemon): Promise<number> {
    const existingEntry = await db.trackedPokemons.get({ pokeId: pokemon.pokeId, userId: pokemon.userId });
    if(existingEntry){
      return existingEntry.id;
    }
    return 0;
  }

  async getTrackedPokemonsByUserId(userId: number): Promise<ITrackedPokemon[]> {
    return this.trackedPokemons.where({ userId }).toArray();
  }

  async deletePokemonFromTracked(id: number){
    db.trackedPokemons.delete(id);
  }
}

export const db = new AppDB();