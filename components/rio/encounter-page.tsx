'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckoutDialog } from './public-home';
import type { RioEvent } from '@/lib/rio-db';
export function EncounterAction({event,type,label}:{event:RioEvent;type:'attendee'|'server';label:string}){const [open,setOpen]=useState(false);return <><Button onClick={()=>setOpen(true)} className="mt-6 h-12 w-full rounded-full">{label}</Button><CheckoutDialog event={event} kind={open?type:null} onClose={()=>setOpen(false)}/></>}
