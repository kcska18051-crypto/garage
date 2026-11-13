import { Navigate, useLocation } from 'react-router-dom'
import type { ServiceRequest } from '../../data/serviceTypes'
export function ServiceRequestEntry({ request }: { request: ServiceRequest; onClose(): void }) {
 const location = useLocation()
 const params = new URLSearchParams({ kind:request.kind, item:request.itemId, from:location.pathname })
 return <Navigate to={'/services/request?' + params.toString()} />
}
