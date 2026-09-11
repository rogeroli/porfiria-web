import { useQuery } from '@tanstack/react-query';
import { listActiveProfiles } from '@/services/profiles/profiles-service';

export function useActiveProfiles() {
  return useQuery({
    queryKey: ['active-profiles'],
    queryFn: listActiveProfiles,
  });
}
