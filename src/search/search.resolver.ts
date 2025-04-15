import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchFilterDto } from './dtos/search-filter.dto';
import { SearchUnionData } from './object-types/search-union.object-type';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}
  @Query(() => SearchUnionData)
  search(@Args('filter') filter: SearchFilterDto) {
    return this.searchService.search(filter);
  }
}
