import { useMemo } from 'react';
import { useClient } from 'sanity';

export function useVersionedClient() {
    const client = useClient({apiVersion: '2022-10-01'})
    return useMemo(() => client.withConfig({apiVersion: '2022-10-01'}), [client])
}

export default useVersionedClient
