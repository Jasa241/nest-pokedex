import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Sse } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

 async create(createPokemonDto: CreatePokemonDto) {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      try{
        const pokemon = await this.pokemonModel.create( createPokemonDto );
        return pokemon;
      }catch(err)
      {
       this.handelExceptions(err);
      }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon:Pokemon;

    if(!isNaN(+term))
    {
      pokemon = await this.pokemonModel.findOne( {no:term});
    }

    if(isValidObjectId(term))
    {
      pokemon = await this.pokemonModel.findById(term);
    }

    if(!pokemon)
    {
      pokemon = await this.pokemonModel.findOne({name:term.toLowerCase().trim()});
    }

    if(!pokemon)
      throw new NotFoundException(`Pokemon with data ${ term } not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if(UpdatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try{
    
      const pokemonDB = await pokemon.updateOne(updatePokemonDto);
      
      return {...pokemonDB.JSON, ...updatePokemonDto};

    }catch(err)
    {
      this.handelExceptions(err);
    }
  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    
    if(deletedCount === 0)
        throw new BadRequestException(`Pokemon with id ${ id } not found`);
      
  }

  private handelExceptions(err:any){
    if(err.code === 11000)
      {
        throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( err.keyValue )}`);
      }
      console.log(err);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
  }
}
