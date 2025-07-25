import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filter: 'all' | 'pending' | 'paid' | 'expiring') => void;
  activeFilter: string;
}

export const SearchFilters = ({ onSearch, onFilter, activeFilter }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const filterOptions = [
    { value: 'all', label: 'Todos los usuarios' },
    { value: 'pending', label: 'Pagos pendientes' },
    { value: 'paid', label: 'Pagados este mes' },
    { value: 'expiring', label: 'Vencen pronto' }
  ];

  return (
    <div className="space-y-3">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-muted-foreground" />
        <Select value={activeFilter} onValueChange={(value) => onFilter(value as any)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};