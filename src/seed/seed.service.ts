import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
  ){}

  async executeSeed() {

    const {data} = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650");

    const listpokemon:CreatePokemonDto[] = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      const pokemon = new CreatePokemonDto();
      pokemon.name = name.toLowerCase();
      pokemon.no = no;

      listpokemon.push(pokemon);
    })

    const result = await this.pokemonModel.insertMany(listpokemon);

      console.log(result)

    return result;
  }
}
