'use client'
import React,{createContext,useContext,useMemo} from 'react'
import {useArtAdmin} from './art-admin-context'
import {effectivePermissions} from '@/lib/admin-permissions'
export type AdminRole = 'Admin'|'Moderator'|'Seller'
export const AdminAuthContext=createContext<any>(null)
export function AdminAuthProvider({children}:{children:React.ReactNode}){
 const a=useArtAdmin()
 const permissions=useMemo(()=>effectivePermissions(a.admin),[a.admin])
 const value={...a,permissions,hasRole:(role:string)=>a.admin?.role===role,hasPermission:(permission:string)=>!!permissions[permission as keyof typeof permissions],canEdit:()=>!!a.admin,logout:async()=>{const {getAuth,signOut}=await import('firebase/auth');await signOut(getAuth())}}
 return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
export const useAdminAuth=()=>useContext(AdminAuthContext)||{}
