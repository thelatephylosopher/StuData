import SearchFilterBar from '../SearchFilterBar'

export default function SearchFilterBarExample() {
  return (
    <SearchFilterBar 
      onSearch={(filters) => console.log('Search filters:', filters)} 
    />
  )
}
